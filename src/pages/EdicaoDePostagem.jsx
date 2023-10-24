import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, apiAuthorizationToken, userToken } from './apiConfig';
import "../styles/FormularioCadastro.css";

function EdicaoDePostagem(props) {
    const { id } = useParams(); // Obtém o ID da postagem da URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null); // Estado para armazenar os dados da postagem a ser editada

    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para rastrear o envio do formulário

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

                setFormData(data); // Define os dados da postagem no estado "formData"
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
            }
        };

        fetchData(); // Chama a função fetchData ao montar o componente, com base em "id"
    }, [id]); // O efeito é acionado sempre que "id" muda

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Atualiza os dados da postagem com base nas alterações do formulário
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            alert('O campo título é obrigatório. Preencha antes de enviar.');
            return;
        }

        setIsSubmitting(true); // Ativa o estado isSubmitting antes do envio

        try {
            // Envia uma solicitação para atualizar a postagem com os dados editados
            const response = await axios.put(`${API_URL}/posts/${id}`, formData, {
                headers: {
                    'Api-Authorization': apiAuthorizationToken,
                    'Authorization': userToken,
                },
            });

            setIsSubmitting(false); // Desativa o estado isSubmitting após o envio

            if (response.status === 200) {
                navigate('/'); // Redireciona de volta à página inicial após a edição bem-sucedida
            } else {
                alert('Erro na edição da postagem.'); // Mensagem de erro genérica
            }
        } catch (error) {
            console.error('Erro ao editar a postagem:', error);
            setIsSubmitting(false); // Certifique-se de desativar o estado isSubmitting em caso de erro
        }
    };

    function getCurrentISODate() {
        const now = new Date();
        const isoString = now.toISOString();
        return isoString;
    }

    return (
        <div className='listMain2'>
            <h1>Edição de Postagem</h1>

            {formData ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Título</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Tags</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Link do YouTube</label>
                        <input
                            type="text"
                            name="youtube_link"
                            value={formData.youtube_link}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Texto Principal</label>
                        <textarea
                            name="primary_text"
                            value={formData.primary_text}
                            onChange={handleInputChange}
                            cols="42" rows="5"
                        />
                    </div>
                    <div>
                        <label>Texto Secundário</label>
                        <textarea
                            name="secondary_text"
                            value={formData.secondary_text}
                            onChange={handleInputChange}
                            cols="42" rows="5"
                        />
                    </div>
                    <div>
                        <label>Título SEO</label>
                        <input
                            type="text"
                            name="seo_title"
                            value={formData.seo_title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Tags SEO</label>
                        <input
                            type="text"
                            name="seo_tags"
                            value={formData.seo_tags}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        {isSubmitting ? (
                            <button type="submit" disabled>Enviando...</button>
                        ) : (
                            <button type="submit">Salvar Edições</button>
                        )}
                    </div>
                </form>
            ) : (
                <p>Carregando Edição de Postagem...</p>
            )}
        </div>
    );
}

export default EdicaoDePostagem;
