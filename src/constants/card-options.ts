export const CURRENT_MONTH: string = `0${new Date().getMonth() + 1}`;

export const MONTHS_ARRAY: IOption[] = Array.from({ length: 12 }).map(
  (_: unknown, index: number): IOption => {
    const month: string = "0" + (index + 1);

    const date: Date = new Date();
    date.setMonth(index);
    const monthLabel: string = date.toLocaleString("en-US", { month: "short" });
    return {
      label: `${month} (${monthLabel})`,
      id: month
    };
  }
);

export const YEARS_ARRAY: IOption[] = Array.from({ length: 21 }).map(
  (_: unknown, index: number): IOption => {
    const year: string = (new Date().getFullYear() + index).toString();
    return {
      label: year,
      id: year.slice(-2)
    };
  }
);
