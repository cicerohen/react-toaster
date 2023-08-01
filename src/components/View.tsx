type Props = {
  children: React.ReactNode;
};

export const View = ({ children }: Props) => {
  return (
    <div>
      <header className="sticky top-0 z-10 bg-indigo-600">
        <div className="flex h-20  items-center justify-between px-8 lg:container lg:mx-auto lg:px-0">
          <h1 className="font-semibold text-white">Playground/Toast</h1>
        </div>
      </header>
      <main className="p-8 lg:container lg:mx-auto lg:px-0">{children}</main>
      <footer>
        <p className="mt-4 text-center">
          <a
            className="text-sm text-gray-500"
            href="https://github.com/cicerohen/playground-toast"
            target="_blank"
          >
            View it on Github
          </a>
        </p>
      </footer>
    </div>
  );
};
