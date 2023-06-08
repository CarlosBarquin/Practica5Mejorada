import { gql, useMutation, useQuery} from "@apollo/client";
import { dirname } from "node:path/win32";
import { disconnect } from "process";
import { use, useEffect, useState } from "react";
import styled from "styled-components";



const Formulario = styled.div`
  border: 1px solid #ccc;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 0.3fr;
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
  border: 2px solid red;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: red;
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


const ADD_SLOT = gql`
    mutation Add($year: Int!, $month: Int!, $day: Int!, $hour: Int!){
    addSlot(year: $year, month: $month, day: $day, hour: $hour) {
        day
        month
        year
        hour
        available
    }
    }
`;

const DELETE_SLOT = gql`

    mutation Del($year: Int!, $month: Int!, $day: Int!, $hour: Int!){
    removeSlot(year: $year, month: $month, day: $day, hour: $hour) {
        available
        day
        hour
        year
        month
    }
    }


`;

const GET_SLOTS = gql`
query{
  allSlots {
    year
    month
    day
    hour
    available
    dni
  }
}
`;

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



const pagina = () => {

  const [year, setYear] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [hour, setHour] = useState<number>(0);
  const [dni, setDni] = useState<string>("");

  const[year2, setYear2] = useState<number>(0);
  const[month2, setMonth2] = useState<number>(0);
  const[day2, setDay2] = useState<number>(0);
  const[hour2, setHour2] = useState<number>(0);

  const [year3, setYear3] = useState<number>(0);
  const [month3, setMonth3] = useState<number>(0);
  const [day3, setDay3] = useState<number>(0);
  const [hour3, setHour3] = useState<number>(0);


  

  const [date , setDate] = useState<Date>(new Date(0,0,0,0));


  const { loading, error, data, refetch } = useQuery<{
      allSlots: {
        day: number;
        month: number;
        year: number;
        hour: number;
        available: boolean;
        dni: string;
      }[];
  }>(GET_SLOTS);

  const dateToSlot = (date: Date) => {
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
    setDay(date.getDate());
    setHour(date.getHours());
}

  const [addSlot] = useMutation(ADD_SLOT, {
      variables: { year, month, day, hour },
      onCompleted: () => {
        refetch();
      },
      onError: (error) => {
        alert(error);
      }
  });

  const [deleteSlot] = useMutation(DELETE_SLOT, {
    variables: { year : year2, month : month2,  day : day2, hour: hour2 },
    onCompleted: () => {
      refetch();
    }
});

const [bookSlot] = useMutation(BOOK_SLOT, {
  variables: { year : year3, month : month3, day : day3, hour : hour3, dni: dni },
  onCompleted: () => {
    refetch();
  },
  onError: (error) => {
    alert(error);
  }
});


useEffect(() => {
  if(year2 != 0 && month2 != 0 && day2 != 0 && hour2 != 0){
    deleteSlot();
  }
}, [year2, month2, day2, hour2]);

useEffect(() => {
  if(year3 != 0 && month3 != 0 && day3 != 0 && hour3 != 0 && dni != ""){
    bookSlot();
  }
}, [year3, month3, day3, hour3]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;



    return (
        <>
        <Titulo>Crear Slot</Titulo>
        <input type="datetime-local" placeholder="date" onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setDate(newDate);
                    dateToSlot(newDate);
        }} />

        <button onClick={() => {
            addSlot();
        }
        }>Crear</button>

        <br></br>

        <Titulo>Tabla</Titulo>
        <Formulario>
        <input type="number" placeholder="DNI" onChange={(e) => setDni(e.target.value)}></input>
        <Celda></Celda>
        <Celda></Celda>
        <Celda></Celda>
        <Celda></Celda>
        <Celda></Celda>
        <Celda></Celda>
            <Header>Year</Header>
            <Header>Month</Header>
            <Header>Day</Header>
            <Header>Hour</Header>
            <Header>Available</Header>
            <Header>DNI</Header>
            <Header></Header>
            {data?.allSlots.map((slot) => {
              return(
                <>
                <Celda>{slot.year}</Celda>
                <Celda>{slot.month}</Celda>
                <Celda>{slot.day}</Celda>
                <Celda>{slot.hour}</Celda>
                <Celda>{slot.available ? "Disponible" : "No disponible"}</Celda>
                <Celda>{slot.dni ? slot.dni : "no reserado"}</Celda>
                <Celda>
                  {slot.available && <Button2 onClick={() =>{
                      setYear3(slot.year);
                      setMonth3(slot.month);
                      setDay3(slot.day);
                      setHour3(slot.hour);
                  }   
                  }>reservar</Button2>}
                  <Button onClick={() => {
                
                    setYear2(slot.year);
                    setMonth2(slot.month);
                    setDay2(slot.day);
                    setHour2(slot.hour);

                  }}>delete</Button>
                </Celda>
                </>
              )
            })}
        </Formulario>

            

        
      
        
        </>
    )
}

export default pagina;
