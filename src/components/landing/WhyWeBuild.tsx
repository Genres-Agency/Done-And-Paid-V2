import Image from "next/image";

const WhyWeBuiltThis = () => {
  return (
    <section className=" py-16 container mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Why We Built This</h2>
          <p className="text-lg text-gray-600 mb-6">Because paperwork sucks.</p>
          <p className="text-gray-700 leading-relaxed mb-6">
            You’re not a full-time accountant; you’re a plumber, electrician,
            You’re not a full-time accountant; you’re a plumber, electrician,
            carpenter, or someone who’s actually useful to society. You
            shouldn’t have to learn Excel formulas or fight with clunky apps to
            get paid. That’s why we created this: an invoicing tool that works
            as hard as you do, without asking for overtime.
          </p>
          <div className="flex items-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-lg">✔</span>
              <span className="text-gray-700 font-medium">Coded</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-lg">✔</span>
              <span className="text-gray-700 font-medium">100% Secure</span>
            </div>
          </div>
          <a
            href="#how-it-works"
            className="inline-flex items-center text-blue-600 font-semibold hover:underline"
          >
            <span className="text-white bg-blue-600 p-1 pr-1.5 pl-2 text-xs rounded-full mr-2">
              ▶
            </span>
            See how it works
          </a>
        </div>

        {/* Image Content */}
        <div className="w-full max-w-screen-md lg:max-w-max mx-auto lg:w-1/2 flex justify-center items-center">
          <Image
            src="/whywebuilt.png" // Replace with your actual image path
            alt="Invoice Tool Screenshot"
            width={600}
            height={400}
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyWeBuiltThis;
