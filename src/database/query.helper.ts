export class QueryGenerator<T> {
  private readonly table: string;

  constructor(table: string) {
    this.table = table;
  }

  select(where?: Partial<T>): [string, unknown] {
    if (where) {
      const whereKeys = Object.keys(where)
        .map(key => `${key} = ?`)
        .join(' AND ');

      const whereValues = Object.values(where);

      return [`SELECT * FROM ${this.table} WHERE ${whereKeys};`, whereValues];
    }

    return [`SELECT * FROM ${this.table}`, null];
  }

  insert(data: Partial<T>): [string, unknown] {
    const dataKeys = Object.keys(data).join(', ');
    const valuePlacement = Object.keys(data)
      .map(() => '?')
      .join(', ');
    const dataValues = Object.values(data);

    return [`INSERT INTO ${this.table} (${dataKeys}) VALUE (${valuePlacement})`, dataValues];
  }
}
