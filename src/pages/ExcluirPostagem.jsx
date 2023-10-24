import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import { API_URL, apiAuthorizationToken, userToken } from './apiConfig';
import { useNavigate } from 'react-router-dom';

function DetalhesDaPostagem() {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtém o ID da postagem da URL
    console.log(id); // Exibe o ID no console (para fins de depuração)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Envia uma solicitação para excluir a postagem com o ID fornecido
                const response = await axios.delete(`${API_URL}/posts/${id}`, {
                    headers: {
                        'Api-Authorization': apiAuthorizationToken,
                        'Authorization': userToken,
                    },
                });

                // Após a exclusão bem-sucedida, redireciona de volta à página inicial
                const data = response.data.data;
                navigate('/');
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);

                // Em caso de erro, redireciona de volta à página inicial
                navigate('/');
            }
        };

        fetchData(); // Chama a função fetchData ao montar o componente, com base em "id"
    }, [id]); // O efeito é acionado sempre que "id" muda

    return (
        <></> // Componente vazio (não exibe nada na tela)
    );
}

export default DetalhesDaPostagem;
