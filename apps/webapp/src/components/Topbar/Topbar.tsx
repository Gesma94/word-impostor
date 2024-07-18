export const Topbar: React.FC = () => {
  return (
    <nav className='w-full h-32'>
      <div className='w-full h-full max-w-[1440px] px-14 flex items-center mx-auto'>
        <h1>WORD IMPOSTOR</h1>
        <ul className='flex items-center gap-2 ml-5'>
          <li>
            <a href='/join-room'>Join room</a>
          </li>
          <li>
            <a href='/create-room'>Create room</a>
          </li>
        </ul>
        <div className='ml-auto'>
          <p>Matteo</p>
        </div>
      </div>
    </nav>
  );
};
