export default function currentDate() {
  const date = new Date();
  return `${date.getDate()}-${date.getMonth() + 1}`;
}