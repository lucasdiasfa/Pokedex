import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const ids = [1, 4, 7, 10, 13];


function App() {
  const [pokemons, setPokemons] = useState([]);
  const [primeirasEvolucoes, setPrimeirasEvolucoes] = useState([]);
  const [segundasEvolucoes, setSegundasEvolucoes] = useState([]);

  const vetorDePokemons = [];

  const vetorPrimeirasEvolucoes = [];

  const vetorSegundasEvolucoes = [];

  async function carregarPokemons() {
    ids.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((resposta) => resposta.json())
        .then((data) => {
          vetorDePokemons.push(data);

          fetch(data.species.url)
            .then((resposta) => resposta.json())
            .then((data) => {
              const evolutionURL = data.evolution_chain.url;

              fetch(evolutionURL)
                .then((resposta) => resposta.json())
                .then((data) => {
                  const nomeDaPrimeiraEvolucao =
                    data.chain.evolves_to[0].species.name;
                  const nomeDaSegundaEvolucao =
                    data.chain.evolves_to[0].evolves_to[0].species.name;

                  fetch(
                    `https://pokeapi.co/api/v2/pokemon/${nomeDaPrimeiraEvolucao}`
                  )
                    .then((resposta) => resposta.json())
                    .then((data) => {
                      vetorPrimeirasEvolucoes.push(data);

                      const sortedvetor = vetorPrimeirasEvolucoes.sort(
                        (first, second) => {
                          return first.id > second.id
                            ? 1
                            : second.id > first.id
                            ? -1
                            : 0;
                        }
                      );

                      setPrimeirasEvolucoes([...sortedvetor]);
                    });

                  fetch(
                    `https://pokeapi.co/api/v2/pokemon/${nomeDaSegundaEvolucao}`
                  )
                    .then((resposta) => resposta.json())
                    .then((data) => {
                      vetorSegundasEvolucoes.push(data);
                      const sortedvetor = vetorSegundasEvolucoes.sort(
                        (first, second) => {
                          return first.id > second.id
                            ? 1
                            : second.id > first.id
                            ? -1
                            : 0;
                        }
                      );
                      setSegundasEvolucoes([...sortedvetor]);
                    });
                });
            });
          const sortedvetor = vetorDePokemons.sort((first, second) => {
            return first.id > second.id ? 1 : second.id > first.id ? -1 : 0;
          });

          setPokemons([...sortedvetor]);
        })
    );
  }

  useEffect(() => {
    carregarPokemons();
  }, []);

  if (!pokemons) {
    return null;
  }
  return (
<div className="App">
      <div>
        <h1>Pokémons</h1>
      </div>

      <div className="caixa_pai">
        <div className="caixa_pokemons">
          {pokemons.map((pokemon) => (
            <div className="pokemon">
              <div>
                <h2>Pokémon</h2>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                <p className="pokemon_nome">{pokemon.name}</p>
              </div>

              <div className="detalhes">
                <h2>Detalhes</h2>
                <p>ID: {pokemon.id}</p>
                <p>Habilidade principal: {pokemon.abilities[0].ability.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="evolucoes">
        <>
          {primeirasEvolucoes.map((evolucao) => (
            <div key={evolucao.id}>
              <h2>Evoluções</h2>
              <img src={evolucao.sprites.front_default} alt={evolucao.name} />
              <p className="pokemon_nome">{evolucao.name}</p>
            </div>
          ))}
        </>
        {segundasEvolucoes.map((evolucao) => (
          <div key={evolucao.id}>
            <img src={evolucao.sprites.front_default} alt={evolucao.name} />
            <p className="pokemon_nome">{evolucao.name}</p>
          </div>
        ))}
      </div>
    </div>  );
}

export default App;
