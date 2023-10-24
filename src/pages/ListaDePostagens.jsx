import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importe o Link da biblioteca de roteamento
import { API_URL, apiAuthorizationToken, userToken } from './apiConfig'; // Importe as informações da API e tokens de autorização
import "../styles/ListaDePostagens.css";
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEyeSlash, faCalendarDays, faMagnifyingGlass, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

function ListaDePostagens() {
    const [postagens, setPostagens] = useState([]);
    const [termoDeBusca, setTermoDeBusca] = useState('');
    const [limiteDePostagens, setLimiteDePostagens] = useState(10);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [carregando, setCarregando] = useState(true); // Estado para rastrear se os dados estão carregando

    useEffect(() => {
        // Função para buscar dados da API
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts`, {
                    headers: {
                        'Api-Authorization': apiAuthorizationToken,
                        'Authorization': userToken,
                    },
                });

                const data = response.data.data;
                setPostagens(data);
                setCarregando(false); // Define que os dados foram carregados
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
                setCarregando(false); // Define que os dados foram carregados
            }
        };

        fetchData();
    }, []);

    // Função para filtrar postagens com base no termo de busca
    const filtrarPostagens = () => {
        const postagensFiltradas = postagens.filter(postagem => {
            return postagem.title.toLowerCase().includes(termoDeBusca.toLowerCase());
        });
        return postagensFiltradas;
    };

    // Função para lidar com a mudança no termo de busca
    const handleTermoDeBuscaChange = (e) => {
        setTermoDeBusca(e.target.value);
        setPaginaAtual(1); // Defina a página de volta para a primeira quando o termo de busca for alterado.
    };

    // Calcula as postagens a serem exibidas com base na página atual e no limite
    const postagensFiltradas = termoDeBusca ? filtrarPostagens() : postagens;
    const totalPages = Math.ceil(postagensFiltradas.length / limiteDePostagens);
    const inicio = (paginaAtual - 1) * limiteDePostagens;
    const fim = inicio + limiteDePostagens;
    const postagensExibidas = postagensFiltradas.slice(inicio, fim);

    // Função para lidar com a ação de edição de postagem
    const handleEditar = (postagemId) => {
        // Implemente a lógica para editar a postagem com base no ID
        console.log(`Editar postagem com ID: ${postagemId}`);
    };

    // Função para lidar com a ação de visualização de postagem
    const handleVisualizar = (postagemId) => {
        // Implemente a lógica para excluir a postagem com base no ID
        console.log(`Excluir postagem com ID: ${postagemId}`);
    };

    // Função para ir para a página anterior
    const handlePaginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    // Função para ir para a próxima página
    const handlePaginaProxima = () => {
        if (paginaAtual < totalPages) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    // Função para lidar com o clique em uma página específica
    const handlePaginaClicada = (pageNumber) => {
        setPaginaAtual(pageNumber);
    };

    // Função para formatar a data no formato desejado
    function formatarData(data) {
        const dataFormatada = new Date(data);
        const dia = dataFormatada.getDate().toString().padStart(2, '0');
        const mes = (dataFormatada.getMonth() + 1).toString().padStart(2, '0');
        const ano = dataFormatada.getFullYear();
        const hora = dataFormatada.getHours().toString().padStart(2, '0');
        const minutos = dataFormatada.getMinutes().toString().padStart(2, '0');

        return (
            <>
                {`${dia}/${mes}/${ano}, `}
                <span> {`${hora}:${minutos}`}</span>
            </>
        );
    }

    return (
        <div className='listMain'>
            <div className='header'>
                <h1 className='postTitle'>POSTAGEM</h1>
                <div className='searchInput'>
                    <div className='searchInputControl'>
                        <input
                            type="search"
                            name=""
                            id=""
                            placeholder="Buscar aqui..."
                            value={termoDeBusca}
                            onChange={handleTermoDeBuscaChange}
                        />
                        {termoDeBusca && (
                            <FontAwesomeIcon
                                icon={faTimes}
                                onClick={() => setTermoDeBusca('')} // Limpa o campo de busca
                                className="clearSearch"
                            />
                        )}
                    </div>
                    <FontAwesomeIcon icon={faSearch} className="inputSearch" /> {/* Ícone de busca */}
                </div>
                <Link to="/cadastro" className='cadButton'><button>NOVA POSTAGEM</button></Link>
            </div>
            <div className='body'>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>Título do Conteúdo</th>
                            <th style={{ width: '30%' }}>Tag</th>
                            <th>Publicação</th>
                            <th>Atualização</th>
                            <th>Acesso</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carregando ? ( // Verifica se os dados estão carregando
                            <tr>
                                <td colSpan="6">Carregando postagem...</td>
                            </tr>
                        ) : (
                            postagensExibidas.map(postagem => (
                                <tr key={postagem.id}>
                                    <td>{postagem.title}</td>
                                    <td>{postagem.tags}</td>
                                    <td className='publicationDateControl'>
                                        <div className='publicationDate'>
                                            <div>
                                                <FontAwesomeIcon icon={faCalendarDays} />
                                            </div>
                                            <div>
                                                {formatarData(postagem.published_at)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='publicationDateControl'>
                                        <div className='publicationDate'>
                                            <div>
                                                <FontAwesomeIcon icon={faCalendarDays} />
                                            </div>
                                            <div>
                                                {formatarData(postagem.updated_at)}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{/* Adicione o número de acessos da postagem aqui */}</td>
                                    <td>
                                        <div className='actionIcon'>
                                            <Link className='actionIconEdit' to={`/editar/${postagem.id}`}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <Link className='actionIconView' to={`/detalhes/${postagem.id}`}>
                                                <FontAwesomeIcon icon={faEyeSlash} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className='footer'>
                <div>
                    <p>{postagensExibidas.length} Postagens</p>
                </div>
                <div className='footerButton'>
                    <button
                        onClick={handlePaginaAnterior}
                        disabled={paginaAtual === 1}
                        className={paginaAtual === 1 ? 'disabled2' : 'active2'}
                    >
                        Anterior
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePaginaClicada(index + 1)}
                            className={paginaAtual === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={handlePaginaProxima}
                        disabled={paginaAtual === totalPages} // Desativa quando estiver na última página
                        className={paginaAtual === totalPages ? 'disabled2' : 'active2'}
                    >
                        Próximo
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ListaDePostagens;
