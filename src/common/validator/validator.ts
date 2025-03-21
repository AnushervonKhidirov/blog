export class Validator {
  readonly errors: string[];
  private readonly data: unknown;
  private readonly key: string;

  constructor(data: unknown, key: string) {
    this.errors = [];
    this.data = data;
    this.key = key;
  }

  IsString() {
    if (typeof this.data !== 'string') {
      this.errors.push(`'${this.key}' should be a string`);
    }

    return this;
  }

  IsNumericalString() {
    if (typeof this.data !== 'string' || !RegExp(/^\d+$/).test(this.data)) {
      this.errors.push(`'${this.key}' should be a numerical string`);
    }

    return this;
  }

  IsNotEmpty() {
    if (!this.data || (Array.isArray(this.data) && this.data.length === 0)) {
      this.errors.push(`'${this.key}' should not be empty`);
    }

    return this;
  }
}
