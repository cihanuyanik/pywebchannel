export default function CheckMarkDone(props: any) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm48.19 121.42l24.1 21.06-73.61 84.1-24.1-23.06zM191.93 342.63L121.37 272 144 249.37 214.57 320zm65 .79L185.55 272l22.64-22.62 47.16 47.21 111.13-127.17 24.1 21.06z"></path>
    </svg>
  );
}