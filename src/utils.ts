export const json = JSON.stringify;

/**
 * Print a section header with visual separation
 */
export function section(title: string, description?: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`📌 ${title.toUpperCase()}`);
  if (description) {
    console.log(`   ${description}`);
  }
  console.log('='.repeat(80) + '\n');
}

/**
 * Print a subsection header
 */
export function subsection(title: string) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('─'.repeat(60));
}

/**
 * Pretty print JSON data
 */
export function printData(label: string, data: any) {
  console.log(`\n${label}:`);
  console.log(
    JSON.stringify(
      data,
      (_, value) => (typeof value === 'bigint' ? value.toString() : value),
      2
    )
  );
}

/**
 * Print a success message
 */
export function success(message: string) {
  console.log(`✅ ${message}`);
}

/**
 * Print an info message
 */
export function info(message: string) {
  console.log(`ℹ️  ${message}`);
}

/**
 * Print a warning message
 */
export function warn(message: string) {
  console.log(`⚠️  ${message}`);
}

/**
 * Print a table of results
 */
export function printTable(data: any[]) {
  if (data.length === 0) {
    console.log('(No results)');
    return;
  }
  console.table(data);
}

/**
 * Print count with label
 */
export function printCount(label: string, count: number) {
  console.log(`${label}: ${count}`);
}
