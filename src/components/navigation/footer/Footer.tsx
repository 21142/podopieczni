export interface IFooter {}

const Footer: React.FC<IFooter> = () => {
  return (
    <>
      <div className="aspect-[10/1]">
        <svg
          id="visual"
          viewBox="0 0 3840 384"
          width="3840"
          height="384"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <path
            d="M0 172L64 174.5C128 177 256 182 384 183.2C512 184.3 640 181.7 768 181.8C896 182 1024 185 1152 190.5C1280 196 1408 204 1536 209.7C1664 215.3 1792 218.7 1920 205.3C2048 192 2176 162 2304 151.5C2432 141 2560 150 2688 155.8C2816 161.7 2944 164.3 3072 170.7C3200 177 3328 187 3456 195.8C3584 204.7 3712 212.3 3776 216.2L3840 220L3840 385L3776 385C3712 385 3584 385 3456 385C3328 385 3200 385 3072 385C2944 385 2816 385 2688 385C2560 385 2432 385 2304 385C2176 385 2048 385 1920 385C1792 385 1664 385 1536 385C1408 385 1280 385 1152 385C1024 385 896 385 768 385C640 385 512 385 384 385C256 385 128 385 64 385L0 385Z"
            fill="#eebdf2"
          ></path>
          <path
            d="M0 223L64 226.3C128 229.7 256 236.3 384 229.2C512 222 640 201 768 191.3C896 181.7 1024 183.3 1152 194C1280 204.7 1408 224.3 1536 237.8C1664 251.3 1792 258.7 1920 248.2C2048 237.7 2176 209.3 2304 198.7C2432 188 2560 195 2688 206.2C2816 217.3 2944 232.7 3072 233.8C3200 235 3328 222 3456 225C3584 228 3712 247 3776 256.5L3840 266L3840 385L3776 385C3712 385 3584 385 3456 385C3328 385 3200 385 3072 385C2944 385 2816 385 2688 385C2560 385 2432 385 2304 385C2176 385 2048 385 1920 385C1792 385 1664 385 1536 385C1408 385 1280 385 1152 385C1024 385 896 385 768 385C640 385 512 385 384 385C256 385 128 385 64 385L0 385Z"
            fill="#d88cde"
          ></path>
          <path
            d="M0 244L64 255.5C128 267 256 290 384 298.2C512 306.3 640 299.7 768 291.3C896 283 1024 273 1152 265C1280 257 1408 251 1536 258.5C1664 266 1792 287 1920 295C2048 303 2176 298 2304 288.3C2432 278.7 2560 264.3 2688 265.2C2816 266 2944 282 3072 286.2C3200 290.3 3328 282.7 3456 275.2C3584 267.7 3712 260.3 3776 256.7L3840 253L3840 385L3776 385C3712 385 3584 385 3456 385C3328 385 3200 385 3072 385C2944 385 2816 385 2688 385C2560 385 2432 385 2304 385C2176 385 2048 385 1920 385C1792 385 1664 385 1536 385C1408 385 1280 385 1152 385C1024 385 896 385 768 385C640 385 512 385 384 385C256 385 128 385 64 385L0 385Z"
            fill="#c058ca"
          ></path>
          <path
            d="M0 312L64 315.8C128 319.7 256 327.3 384 326.3C512 325.3 640 315.7 768 317.3C896 319 1024 332 1152 335.3C1280 338.7 1408 332.3 1536 330.3C1664 328.3 1792 330.7 1920 327.5C2048 324.3 2176 315.7 2304 310C2432 304.3 2560 301.7 2688 298.7C2816 295.7 2944 292.3 3072 291.8C3200 291.3 3328 293.7 3456 301C3584 308.3 3712 320.7 3776 326.8L3840 333L3840 385L3776 385C3712 385 3584 385 3456 385C3328 385 3200 385 3072 385C2944 385 2816 385 2688 385C2560 385 2432 385 2304 385C2176 385 2048 385 1920 385C1792 385 1664 385 1536 385C1408 385 1280 385 1152 385C1024 385 896 385 768 385C640 385 512 385 384 385C256 385 128 385 64 385L0 385Z"
            fill="#a704b5"
          ></path>
        </svg>
      </div>
      <footer className="w-full bg-primary-300">
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
    </>
  );
};

export default Footer;
