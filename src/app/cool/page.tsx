export default function CoolPage() {
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>

      <p className="text-gray-text mb-10 leading-relaxed">
        Hi! I’m Harshika, a Computer Engineering student at Georgia Tech who enjoys
        building things that are both useful and thoughtfully designed, whether that
        means working on a smooth user interface, structuring a backend API, or
        debugging something until it finally makes sense. Outside of engineering, I
        love spending time on creative hobbies like pottery, cooking, and reading.
        Pottery is one of my favorites because it’s very hands-on and relaxing, and I
        enjoy slowly shaping something physical from scratch.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Pottery</h2>
      <p className="text-gray-text mb-6">A few pieces I’ve made recently:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-lg overflow-hidden border border-gray-stroke bg-white">
          <img
            src="https://drive.google.com/file/d/1zlLf-CPIdHQXtD3GuN3VMbeYeXBi127z/view?usp=sharing"
            alt="Pottery piece 1"
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="rounded-lg overflow-hidden border border-gray-stroke bg-white">
          <img
            src="https://drive.google.com/file/d/11HXn9yVVPYcW5eD5tuKchyTDFZPeI3GM/view?usp=sharing"
            alt="Pottery piece 2"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}
