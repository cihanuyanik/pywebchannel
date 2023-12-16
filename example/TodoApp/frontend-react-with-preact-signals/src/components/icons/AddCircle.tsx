export default function AddCircle() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="200px"
      width="200px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        strokeMiterlimit="10"
        strokeWidth="32"
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
      ></path>
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M256 176v160m80-80H176"
      ></path>
    </svg>
  );
}
