// A fixed 64px avatar centered in one module; the name starts on the next column line
export default function HomeLink () {
  return (
    <a href='/' className="home-link">
      <img
        src='/images/avatar.svg'
        width="48"
        height="48"
        alt=''
      />
      Jxnblk
    </a>
  );
};
