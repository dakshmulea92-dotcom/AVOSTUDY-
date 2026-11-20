interface AvocadoMarkProps {
  className?: string;
}

export function AvocadoMark({ className = 'w-7 h-7' }: AvocadoMarkProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18 3C13.5 3 10.6 7.4 9.1 12.2C7.4 17.6 6.5 22.8 8.3 27.3C10.1 31.6 13.8 33 18 33C22.2 33 25.9 31.6 27.7 27.3C29.5 22.8 28.6 17.6 26.9 12.2C25.4 7.4 22.5 3 18 3Z"
        fill="#4A6B22"
      />
      <path
        d="M18 5.5C14.7 5.5 12.4 9 11.2 13C9.7 17.8 9.1 22.2 10.6 25.9C11.9 29.2 14.8 30.5 18 30.5C21.2 30.5 24.1 29.2 25.4 25.9C26.9 22.2 26.3 17.8 24.8 13C23.6 9 21.3 5.5 18 5.5Z"
        fill="#D9E6B8"
      />
      <circle cx="18" cy="22" r="5.2" fill="#5C3D24" />
      <circle cx="16.4" cy="20.4" r="1.4" fill="#825B3C" />
    </svg>
  );
}
