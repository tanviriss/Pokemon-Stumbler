import React, { useState, useEffect } from 'react';
import { ArrowRight, Ban } from 'lucide-react';

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: { front_default: string };
  height: number;
  weight: number;
}

const PokemonStumbler: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [banList, setBanList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRandomPokemon = async () => {
    setIsLoading(true);
    try {
      let newPokemon: Pokemon = {
        id: 0,
        name: '',
        types: [],
        sprites: { front_default: '' },
        height: 0,
        weight: 0
      };
      let isBanned = true;
      while (isBanned) {
        const randomId = Math.floor(Math.random() * 898) + 1; // There are 898 Pokémon in the API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        newPokemon = await response.json();
        isBanned = banList.some(ban => 
          newPokemon.name.toLowerCase().includes(ban.toLowerCase()) || 
          newPokemon.types.some(t => t.type.name.toLowerCase().includes(ban.toLowerCase())) ||
          newPokemon.id.toString() === ban ||
          newPokemon.height.toString() === ban ||
          newPokemon.weight.toString() === ban
        );
      }
      setPokemon(newPokemon);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  const addToBanList = (item: string) => {
    if (!banList.includes(item)) {
      setBanList([...banList, item]);
    }
  };

  const removeBan = (item: string) => {
    setBanList(banList.filter(ban => ban !== item));
  };

  const renderClickableValue = (label: string, value: string | number) => (
    <span 
      className="ml-2 text-blue-600 cursor-pointer hover:underline"
      onClick={() => addToBanList(value.toString())}
    >
      {value}
    </span>
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Pokémon Stumbler</h1>
      
      {pokemon && (
        <div className="mb-6">
          <img 
            src={pokemon.sprites.front_default} 
            alt={pokemon.name} 
            className="mx-auto mb-4 w-48 h-48"
          />
          <p className="text-lg font-semibold mb-2">
            Name: {renderClickableValue('Name', pokemon.name)}
          </p>
          <p className="text-lg font-semibold mb-2">
            ID: {renderClickableValue('ID', pokemon.id)}
          </p>
          <p className="text-lg font-semibold mb-2">
            Types: 
            {pokemon.types.map((type, index) => (
              <span key={index}>
                {renderClickableValue('Type', type.type.name)}
                {index < pokemon.types.length - 1 && ', '}
              </span>
            ))}
          </p>
          <p className="text-lg font-semibold mb-2">
            Height: {renderClickableValue('Height', pokemon.height)} dm
          </p>
          <p className="text-lg font-semibold mb-2">
            Weight: {renderClickableValue('Weight', pokemon.weight)} hg
          </p>
        </div>
      )}

      <button
        onClick={fetchRandomPokemon}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 flex items-center justify-center"
      >
        {isLoading ? 'Loading...' : (
          <>
            Next Pokémon
            <ArrowRight className="ml-2" size={20} />
          </>
        )}
      </button>

      {banList.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Ban List</h2>
          <ul className="space-y-2">
            {banList.map((item, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-100 py-1 px-2 rounded">
                <span>{item}</span>
                <button
                  onClick={() => removeBan(item)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Ban size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PokemonStumbler;