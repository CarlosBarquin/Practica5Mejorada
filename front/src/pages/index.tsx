import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #005bea;
  }
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>Hospital Imaginario</title>
      </Head>

      <Container>
        <Title>HOSPITAL IMAGINARIO</Title>
        <Subtitle>Eres médico o paciente</Subtitle>
        <ButtonContainer>
          <Link href="/medico/">
            <Button>Medico</Button>
          </Link>
          <Link href="/paciente/">
            <Button>Paciente</Button>
          </Link>
        </ButtonContainer>
      </Container>
    </>
  )
}