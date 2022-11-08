import { useToast, VStack } from "native-base";
import { useRoute } from '@react-navigation/native'
import { useState, useEffect } from "react";


import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCardPros } from "../components/PoolCard";

import {api} from '../services/api'

interface RouteParams {
    id: string
}

export function Details() {

    const route = useRoute()
    const { id } = route.params as RouteParams

    const [isLoading, setIsLoading] = useState(true)
    const [ poolDetails , setpoolDetails] = useState<PoolCardPros>({} as PoolCardPros)

    const toast = useToast()



    async function fechPollDatails() {
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}`);
            console.log(response.data.pool)

        } catch (error) {
            console.log(error);

            toast.show({
                title: "Não foi possível carregar os detalhes do Bolão!",
                placement: "top",
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fechPollDatails()
    }, [id]);

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Título do Bolão" showBackButton showShareButton />
        </VStack>
    )
}