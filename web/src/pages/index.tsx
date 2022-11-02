import Image from 'next/image'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

import AppPriviewImage from '../assets/appnlw.png'
import LogoImage from '../assets/logo.svg'
import UserAvatar from '../assets/user-avatar-exemples.png'
import IconCheck from '../assets/icon-check.svg'


import Swal from 'sweetalert2'


interface HomeProps {
  poolCount: number,
  guessCount: number,
  userCount: number,
}

export default function Home(props: HomeProps) {

  const [polltitle, setPollTitle] = useState('')

  async function CreatePool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: polltitle
      })

      const { code } = response.data
      console.log(code)

      await navigator.clipboard.writeText(code)


      Swal.fire({
        icon: 'success',
        title: '<strong>Bolão criado com Sucesso! </strong>',
        html: `<br><p> O código do seu Bolão é <b>${code} </b> </p><br>
        <p> O código foi copiado para a Área de Trabalho.</p> `,

      })
      setPollTitle("")


    } catch (erro) {
      console.log(erro)
      alert("Falha ao criar o Bolão")
    }

  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center '>
      <main>
        <Image src={LogoImage} alt="NLW Copa" />
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie o seu próprio bolão da copae compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={UserAvatar} alt="" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-igite-500'> +{props.userCount} </span> pessoas já estão usando
          </strong>
        </div>

        <form className='mt-10 flex gap-2' onSubmit={CreatePool}>
          <input
            type="text"
            required
            placeholder='Qual o nome do seu bolão?'
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            onChange={event => setPollTitle(event.target.value)}
            value={polltitle}
          />
          <button type="submit" className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'>
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={IconCheck} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'> +{props.poolCount} </span>
              <span> Bolões Criados </span>
            </div>
          </div>
          <div className='w-px h-12 bg-slate-600'></div>
          <div className='flex items-center gap-6'>
            <Image src={IconCheck} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'> +{props.guessCount} </span>
              <span> Palpites Enviados </span>
            </div>
          </div>
        </div>


      </main>

      <Image
        src={AppPriviewImage}
        alt="Dois celular exibindo a Tela da Aplicação Mobile"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {

  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get("pools/cont"),
    api.get("guesses/cont"),
    api.get("users/cont")

  ])


  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }

}
