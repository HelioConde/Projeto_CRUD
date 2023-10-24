import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importe o useNavigate
import { Link } from 'react-router-dom'; // Importe o Link da biblioteca de roteamento
import axios from 'axios';
import { API_URL, apiAuthorizationToken, userToken } from './apiConfig';
import "../styles/DetalhesDaPostagem.css";

function DetalhesDaPostagem() {
    const { id } = useParams(); // Obtém o ID da postagem da URL
    const [postagem, setPostagem] = useState(null); // Estado para armazenar os detalhes da postagem
    const [mostrarConfirmacaoExcluir, setMostrarConfirmacaoExcluir] = useState(false); // Estado para controlar a exibição da confirmação de exclusão
    const navigate = useNavigate(); // Função para navegação entre páginas

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Envia uma solicitação para buscar os detalhes da postagem com o ID fornecido
                const response = await axios.get(`${API_URL}/posts/${id}`, {
                    headers: {
                        'Api-Authorization': apiAuthorizationToken,
                        'Authorization': userToken,
                    },
                });

                const data = response.data.data;
                setPostagem(data); // Define os detalhes da postagem no estado "postagem"
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
            }
        };

        fetchData(); // Chama a função fetchData ao montar o componente, com base em "id"
    }, [id]); // O efeito é acionado sempre que "id" muda

    const handleExcluirClick = () => {
        setMostrarConfirmacaoExcluir(true); // Ativa a exibição da confirmação de exclusão
    };

    const handleConfirmarExclusao = (postId) => {
        // Implemente a lógica de exclusão aqui
        // Após a exclusão, você pode redirecionar o usuário de volta para a lista de postagens
        // Use o navigate para redirecionar o usuário
        navigate(`/excluir/${postId}`); // Redireciona o usuário para a página de exclusão com o ID da postagem
    };

    return (
        <div className='listMain2'>
            <h1>Detalhes da Postagem</h1>
            {postagem ? (
                <div className='listInfo'>
                    {/* Exibe os detalhes da postagem se estiverem disponíveis */}
                    <div>Título: {postagem.title}</div>
                    <div>Data de Publicação: {postagem.published_at}</div>
                    <div>Descrição: {postagem.seo_title}</div>
                    <div>Tags: {postagem.tags}</div>
                    <div>Data em Destaque Até: {postagem.featured_until}</div>
                    <div>Link do YouTube: {postagem.youtube_link || 'Nenhum link fornecido'}</div>
                    <div>Texto Principal: {postagem.primary_text || 'Nenhum texto fornecido'}</div>
                    <div>Texto Secundário: {postagem.secondary_text || 'Nenhum texto fornecido'}</div>
                    <div>Tags de SEO: {postagem.seo_tags || 'Nenhuma tag de SEO fornecida'}</div>
                    {/* Adicione outros campos conforme necessário */}
                    <div className='listButton'>
                        <button onClick={handleExcluirClick}>Excluir</button>

                        <Link className='listButton2' to={`/editar/${postagem.id}`}>
                            Editar
                        </Link>
                    </div>

                    {mostrarConfirmacaoExcluir && (
                        <div className='boxAlert'>
                            {/* Exibe a confirmação de exclusão se "mostrarConfirmacaoExcluir" for verdadeiro */}
                            <p>Tem certeza de que deseja excluir esta postagem?</p>
                            <div>
                                <button onClick={() => setMostrarConfirmacaoExcluir(false)}>Não</button>
                                <button onClick={() => handleConfirmarExclusao(postagem.id)}>Sim</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>Carregando os detalhes da postagem...</p>
            )}
        </div>
    );
}

export default DetalhesDaPostagem;
