import { useState, useEffect } from "react";

function FoodAiUpload() {
  const [image, setImage] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSimilarImage, setSelectedSimilarImage] = useState(null);
  const [confirmPage, setConfirmPage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [similarImages, setSimilarImages] = useState([]);

  useEffect(() => {
    fetch("/api/food-info")
      .then((res) => res.json())
      .then((data) => {
        setFoodName(data.name);
        setFoodDescription(data.description);
        setSimilarImages(data.similarImages);
      })
      .catch((err) => console.error("Failed to fetch food info:", err));
  }, []);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target.result);
          setUploaded(true);
          setLoading(false);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };

  const handleUrlUpload = () => {
    if (imageUrl) {
      setLoading(true);
      setTimeout(() => {
        setImage(imageUrl);
        setUploaded(true);
        setLoading(false);
      }, 1500);
    }
  };

  const handleSimilarImageClick = (img) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedSimilarImage(img);
      setConfirmPage(true);
      setLoading(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (confirmPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
        <h2 className="text-3xl font-bold mb-4">Food.ai</h2>
        <div className="flex flex-row gap-6">
          <img src={image} alt="Uploaded" className="w-64 h-64 object-cover rounded-lg shadow-lg" />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{foodName}</h2>
            <p className="text-gray-700">{foodDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  if (uploaded && image) {
    return (
      <div className="flex flex-row items-center justify-center min-h-screen p-6 bg-gray-100">
        <div className="w-1/2 flex justify-center">
          <img src={image} alt="Uploaded" className="w-64 h-64 object-cover rounded-lg shadow-lg" />
        </div>
        <div className="w-1/2 p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Similar Images</h2>
          <div className="grid grid-cols-3 gap-4">
            {similarImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Similar"
                className="w-24 h-24 object-cover rounded-lg shadow cursor-pointer hover:opacity-75"
                onClick={() => handleSimilarImageClick(img)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">Food.ai</h1>
      <div className="p-6 bg-white shadow-lg rounded-xl w-96 text-center">
        <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
          <span className="text-sm text-gray-600">Upload</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
        </label>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border p-2 w-full rounded-lg"
          />
          <button
            onClick={handleUrlUpload}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload via URL
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <FoodAiUpload />;
}
