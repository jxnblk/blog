import Avatar from './Avatar';

// A fixed 64px avatar centered in one module; the name starts on the next column line
export default function HomeLink () {
  return (
    <a href='/' className="home-link caps">
      <Avatar size={48} />
      Jxnblk
    </a>
  );
};
