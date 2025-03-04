
interface Props {
   inverted?: boolean; // darken or lighten the background
   content?: string;
}

export default function LoadingComponent({inverted = true, content = 'Loading...'}: Props) {
  return (
    <>
    {inverted}
    {content}
    </>
  )
}
