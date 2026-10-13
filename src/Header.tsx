import Nav from './Nav';
import ColorModeButton from './ColorModeButton.js';

export default function Header (props: {
  home?: boolean;
}) {
  return (
    <header>
      <div>
        <div></div>
        <div>
          v512.16.0
        </div>
        <ColorModeButton />
      </div>
      <div>
        <a href='/'>
          Jxnblk
        </a>
      </div>
      {props.home && (
        <>
          <hr />
          <div>
            <h1>
              <span>
                Brent Jackson
              </span>
              <br />
              <span>
                Aspiring indie game developer, software engineer, and proud cat parent
                <br />
                Based in Brooklyn, NY
              </span>
            </h1>
            <div />
            <div>
              <div
                style={{
                  width: 128,
                  height: 128,
                }}>
                <div>
                  2023
                </div>
              </div>
              <div>
                <img
                  src='/images/avatar.svg'
                  alt='Avatar'
                  width='128'
                  height='128'
                />
              </div>
            </div>
          </div>
        </>
      )}
      <hr />
      <Nav />
    </header>
  );
};
