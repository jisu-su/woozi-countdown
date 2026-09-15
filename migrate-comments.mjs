/**
 * 우지 댓글을 허브(seventeen-countdown) DB로 옮기기 위한 변환 스크립트
 *
 * 하는 일
 *   wrangler d1 export 로 받은 우지 백업 .sql 을 읽어서,
 *   허브 스키마에 맞는 INSERT 문으로 바꿔 새 .sql 파일에 쓴다.
 *
 * 왜 필요한가
 *   우지 테이블에는 member_id 컬럼이 없다. 허브 테이블에는 있다.
 *   옮기면서 모든 행에 'woozi' 를 채워 넣어야 한다.
 *   그리고 id 를 그대로 옮기면 허브에 이미 있는 번호와 부딪힐 수 있으므로
 *   id 는 빼고 허브가 새로 매기게 한다.
 *
 * 쓰는 법
 *   node migrate-comments.mjs
 *   node migrate-comments.mjs <백업파일> <출력파일> <멤버id>
 *
 * 전환 당일에 백업을 다시 뜬 뒤 이 스크립트를 다시 돌리면 된다.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE_TABLE = 'comments';
const TARGET_COLUMNS = ['member_id', 'dday', 'text', 'author', 'date'];

const [, , inputPath = 'woozi-backup.sql',
          outputPath = 'woozi-to-hub-backup.sql',
          memberId = 'woozi'] = process.argv;

/**
 * SQL 값 목록을 쪼갠다.
 *
 * 쉼표로 그냥 자르면 댓글 안에 있는 쉼표까지 잘린다. 작은따옴표 안쪽인지
 * 아닌지를 보면서 잘라야 한다. SQL 에서 문자열 안의 작은따옴표는 두 번
 * 겹쳐서('') 표현하므로 그것도 함께 처리한다.
 *
 * @param {string} text  VALUES( 와 ) 사이의 내용
 * @returns {string[]}   값 하나하나 (따옴표 포함된 원본 그대로)
 */
function splitSqlValues(text) {
    const values = [];
    let current = '';
    let inString = false;

    for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];

        if (inString) {
            if (ch === "'") {
                if (text[i + 1] === "'") {   // '' 는 문자열 안의 작은따옴표
                    current += "''";
                    i += 1;
                    continue;
                }
                inString = false;
            }
            current += ch;
            continue;
        }

        if (ch === "'") {
            inString = true;
            current += ch;
            continue;
        }

        if (ch === ',') {
            values.push(current.trim());
            current = '';
            continue;
        }

        current += ch;
    }

    values.push(current.trim());
    return values;
}

/**
 * INSERT 문 하나를 처음부터 끝까지 읽는다.
 *
 * 댓글에 줄바꿈이 들어 있으면 INSERT 문이 여러 줄에 걸친다. 그래서 줄 단위로
 * 자르지 않고, 문자열 바깥에 있는 세미콜론을 만날 때까지 읽는다.
 *
 * @returns {{statement: string, endIndex: number}}
 */
function readStatement(sql, startIndex) {
    let inString = false;

    for (let i = startIndex; i < sql.length; i += 1) {
        const ch = sql[i];

        if (inString) {
            if (ch === "'") {
                if (sql[i + 1] === "'") { i += 1; continue; }
                inString = false;
            }
            continue;
        }

        if (ch === "'") { inString = true; continue; }
        if (ch === ';') {
            return { statement: sql.slice(startIndex, i), endIndex: i + 1 };
        }
    }

    throw new Error('끝나지 않은 INSERT 문이 있다. 백업 파일이 잘렸을 수 있다.');
}

function main() {
    const sql = readFileSync(inputPath, 'utf8');

    // INSERT INTO "comments" (...) VALUES(...)  /  INSERT INTO comments ...
    const headerPattern = new RegExp(
        `INSERT\\s+INTO\\s+"?${SOURCE_TABLE}"?\\s*\\(([^)]*)\\)\\s*VALUES\\s*\\(`,
        'gi'
    );

    const rows = [];
    let match;

    while ((match = headerPattern.exec(sql)) !== null) {
        const columns = match[1]
            .split(',')
            .map(c => c.trim().replace(/^["'`]|["'`]$/g, ''));

        const { statement, endIndex } = readStatement(sql, headerPattern.lastIndex);

        // statement 끝의 닫는 괄호를 떼어낸다
        const closing = statement.lastIndexOf(')');
        if (closing === -1) throw new Error('VALUES 의 닫는 괄호를 찾지 못했다.');

        const values = splitSqlValues(statement.slice(0, closing));

        if (values.length !== columns.length) {
            throw new Error(
                `컬럼 ${columns.length}개인데 값이 ${values.length}개다. 파싱이 잘못됐다.`
            );
        }

        const row = {};
        columns.forEach((col, idx) => { row[col] = values[idx]; });
        rows.push(row);

        headerPattern.lastIndex = endIndex;
    }

    if (rows.length === 0) {
        console.error(`  ❌ ${inputPath} 에서 ${SOURCE_TABLE} INSERT 를 하나도 찾지 못했다.`);
        process.exit(1);
    }

    // 허브에 없는 컬럼이 우지 백업에 있으면 알려준다 (조용히 버리지 않는다)
    const sourceColumns = Object.keys(rows[0]);
    const dropped = sourceColumns.filter(c => c !== 'id' && !TARGET_COLUMNS.includes(c));
    const missing = TARGET_COLUMNS.filter(c => c !== 'member_id' && !sourceColumns.includes(c));

    if (missing.length) {
        console.error(`  ❌ 백업에 없는 컬럼이 있다: ${missing.join(', ')}`);
        process.exit(1);
    }

    const quoted = (v) => (v === undefined || v.toUpperCase?.() === 'NULL') ? 'NULL' : v;

    const lines = [
        `-- 우지 댓글 -> 허브 이전용`,
        `-- 원본: ${inputPath}`,
        `-- 생성: ${new Date().toISOString()}`,
        `-- 건수: ${rows.length}`,
        `--`,
        `-- id 는 옮기지 않는다. 허브가 새로 매긴다.`,
        `-- 두 번 실행하면 댓글이 두 배가 된다. 실행 전에 아래로 확인할 것:`,
        `--   npx wrangler d1 execute seventeen-comments --remote \\`,
        `--     --command "SELECT COUNT(*) FROM comments WHERE member_id='${memberId}'"`,
        ``,
    ];

    for (const row of rows) {
        const values = [
            `'${memberId}'`,
            quoted(row.dday),
            quoted(row.text),
            quoted(row.author),
            quoted(row.date),
        ];
        lines.push(
            `INSERT INTO comments (${TARGET_COLUMNS.join(', ')}) VALUES (${values.join(', ')});`
        );
    }

    writeFileSync(outputPath, lines.join('\n') + '\n', 'utf8');

    const ddays = [...new Set(rows.map(r => r.dday.replace(/^'|'$/g, '')))];

    console.log(`  읽은 파일   : ${inputPath}`);
    console.log(`  댓글 건수   : ${rows.length}`);
    console.log(`  member_id   : '${memberId}' 로 채움`);
    console.log(`  D-day 종류  : ${ddays.length}개 (${ddays.slice(0, 5).join(', ')}${ddays.length > 5 ? ' ...' : ''})`);
    if (dropped.length) {
        console.log(`  ⚠️ 허브에 없어서 버린 컬럼: ${dropped.join(', ')}`);
    }
    console.log(`  만든 파일   : ${outputPath}`);
}

main();
