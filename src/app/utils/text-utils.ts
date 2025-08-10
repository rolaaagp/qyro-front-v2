export interface PropsSliceText {
  text: string;
  start: number;
  end: number;
}

export function sliceText(props: PropsSliceText): string {
  const { text, start, end } = props;
  return text.length > end ? text.slice(start, end) + '...' : text;
}
