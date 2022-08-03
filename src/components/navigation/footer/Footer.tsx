export interface IFooter {}

const Footer: React.FC<IFooter> = () => {
  return (
    <footer className="w-full bg-primary-200">
      <div className="aspect-[3/1] w-full bg-cover bg-no-repeat bg-center bg-[url('/images/footer-wave.svg')]"></div>
      <div className="flex flex-col justify-center items-center">
        <div className="grid max-w-[77.5rem] grid-cols-2 gap-6 py-8 mt-2 px-6 md:grid-cols-4 text-neutral-50">
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">
              Mapa strony
            </h2>
            <ul className="">
              <li className="mb-4">
                <a href="#" className=" hover:underline">
                  Główna
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Adopcja
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Edukacja
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Adopcja</h2>
            <ul className="">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Poznaj proces
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Adoptuj psa
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Adoptuj kota
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Znajdź schroniska
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Kontakt</h2>
            <ul className="">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Adres email
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Numery telefonu
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Prawne</h2>
            <ul className="">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Polityka prywatności
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Przetwarzanie danych osobowych
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="py-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-neutral-0 sm:text-center">
            © 2022 podopieczni™
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
