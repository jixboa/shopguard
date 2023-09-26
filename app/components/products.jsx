export default function ProductItems({ name, price, description, picture }) {
  return (
    <>
      <div className="w-64">
        <div className="bg-blue-100 p-5 rounded-xl w-26">
          <img className="" src={picture} alt="" />
        </div>
        <div className="mt-2">
          <h3 className="font-bold text-lg">{name}</h3>
        </div>
        <p className="text-sm mt-1 leading-4">{description}</p>
        <div className="flex mt-1">
          <div className="text-2xl font-bold grow">Gh₵ {price}</div>
          <button className="bg-emerald-400 text-white py-1 px-3">+</button>
        </div>
      </div>
    </>
  );
}
