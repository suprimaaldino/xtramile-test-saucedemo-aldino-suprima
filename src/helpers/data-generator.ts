/**
 * Random data generator for checkout fields.
 * Used in data-driven tests to create unique customer data at runtime.
 */

/** Generate a random alphanumeric string of given length */
export function randomString(length: number): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/** Generate a random first name */
export function randomFirstName(): string {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank'];
  return names[Math.floor(Math.random() * names.length)];
}

/** Generate a random last name */
export function randomLastName(): string {
  const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  return surnames[Math.floor(Math.random() * surnames.length)];
}

/** Generate a random US ZIP code (5 digits) */
export function randomZipCode(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}

/** Generate a full random customer object for checkout */
export function randomCustomer() {
  return {
    firstName: randomFirstName(),
    lastName: randomLastName(),
    zipCode: randomZipCode(),
  };
}
