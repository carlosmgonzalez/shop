// Transformaciones para inputs numéricos según best practices de React Hook Form
export const numberInputTransform = {
  input: (value: number): string =>
    isNaN(value) || value === 0 ? "" : value.toString(),
  output: (e: React.ChangeEvent<HTMLInputElement>): number => {
    const output = parseInt(e.target.value, 10);
    return isNaN(output) ? 0 : output;
  },
};
