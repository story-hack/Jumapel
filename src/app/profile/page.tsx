import { UsersNftCollection } from "../../components/UsersNftCollection";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Ideas
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover unique digital artworks and collectibles from talented creators around the world
          </p>
        </div>
        <UsersNftCollection />
      </div>
    </div>
  );
}