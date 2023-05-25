import { getSSRClient } from "@/libs/client";
import { gql, useMutation, useQuery } from "@apollo/client";
import { on } from "events";
import { useEffect, useState } from "react";
import styled from "styled-components";

//book_slot y get_available_slots se hacen en CSR ya que los datos se introducen por inputs que establece el cliente y no por una url
//Realizar las operaciones en el cliente es mejor porque no se tiene que esperar a que el servidor responda
//get_available_slots se podria hacer en SSR pero es mejor CSR porque los datos son staticos y es mas sencillo a la hora de pasar los parametros 



const BOOK_SLOT = gql`
  mutation ($year: Int!, $month: Int!, $day: Int!, $hour: Int!, $dni: String!) {
    bookSlot(year: $year, month: $month, day: $day, hour: $hour, dni: $dni) {
      day
      month
      year
      hour
      available
    }
  }
`;

const GET_AVAILABLE_SLOTS = gql`
  query ($year: Int!, $month: Int!) {
    availableSlots(year: $year, month: $month) {
      available
      day
      month
      hour
      year
      dni
    }
  }
`;

const Pagina = () => {
  const [year, setYear] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [hour, setHour] = useState<number>(0);
  const [dni, setDni] = useState<string>("");
  const [fecth, setFetch] = useState<number>(0);

  const [yearSearchInput, setYearSearchInput] = useState<number>(0);
  const [monthSearchInput, setMonthSearchInput] = useState<number>(0);
  const [yearSearch, setYearSearch] = useState<number>(0);
  const [monthSearch, setMonthSearch] = useState<number>(0);

  const [bookSlot] = useMutation(BOOK_SLOT, {
    variables: { year, month, day, hour, dni },
    onCompleted: () => {
      setFetch(fecth + 1);
    },
    onError: (error) => {
      alert(error);
    }
  });

  const { loading, error, data, refetch } = useQuery<{
    availableSlots: {
      available: boolean;
      day: number;
      month: number;
      hour: number;
      year: number;
      dni: string;
    }[];
  }>(GET_AVAILABLE_SLOTS, {
    variables: {
      year: yearSearch,
      month: monthSearch,
    },
  } );

  const handleSearchSlots = () => {
    setYearSearch(yearSearchInput);
    setMonthSearch(monthSearchInput);
  };


  useEffect(() => {
    refetch({
      year: yearSearch,
      month: monthSearch,
    });
  }, [fecth]);

  useEffect(() => {
    if (year !== 0 && month !== 0 && day !== 0 && hour !== 0) {
      bookSlot();
    }
  }, [year, month, day, hour]);



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;


    

  return (
        <>
  
            <Titulo>Paciente</Titulo> 
                <Formulario>
                <input type="number" placeholder="DNI" onChange={(e) => setDni(e.target.value)}></input>
                <input type="number" placeholder="Año" onChange={(e) => setYearSearchInput(parseInt(e.target.value))}></input>
                <input type="number" placeholder="Mes" onChange={(e) => setMonthSearchInput(parseInt(e.target.value))}></input>
                <Celda></Celda>
                <Celda></Celda>
                <Button onClick={() => {
                    if(monthSearchInput > 12 || monthSearchInput < 1) {
                        alert("Mes no valido");
                    }else{
                      handleSearchSlots();
                    }
                
                }}>Buscar slots</Button>

                <Header>Año</Header>
                <Header>Mes</Header>
                <Header>Dia</Header>
                <Header>Hora</Header>
                <Header>Disponibilidad</Header>
                <Header></Header>
            {yearSearch !== 0 && monthSearch !== 0 && (
              <>
                {data?.availableSlots.length ? (
                  data.availableSlots.map((slot) => {
                    return (
                     <>
                      <Celda>{slot.year}</Celda>
                      <Celda>{slot.month}</Celda>
                      <Celda>{slot.day}</Celda>
                      <Celda>{slot.hour}</Celda>
                      <Celda>{slot.available ? "Disponible" : "No disponible"}</Celda>

                      <Button2 onClick={() =>{

                        setYear(slot.year)
                        setMonth(slot.month)
                        setDay(slot.day)
                        setHour(slot.hour)
                        
                      }}>RESERVAR</Button2>
                    </>
                    ) 
                  }
                )) : (
                  <p>No hay slots disponibles</p>
                )}
              </>
            )}
          </Formulario>
        </>

    )

}

export default Pagina



const Formulario = styled.div`
  border: 1px solid #ccc;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 0.3fr;
  grid-gap: 1px;
  background-color: #fff;
  color: #444;
  margin-bottom: 50px;
`;

const Header = styled.div`
  background-color: #f1f1f1;
  font-weight: bold;
  padding: 20px;
  text-align: left;
`;

const Celda = styled.div`
  padding: 10px 20px 10px 20px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const Titulo = styled.div`
  background-color: blue;
  font-weight: bold;
  padding: 20px;
  text-align: left;
`;

const Button = styled.button`
  background-color: white;
  color: black;
  border: 2px solid blue;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: blue;
    color: white;
  }
`;

const Button2 = styled.button`
  background-color: white;
  color: black;
  border: 2px solid green;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: green;
    color: white;
  }
`;