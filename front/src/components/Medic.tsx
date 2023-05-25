import { gql, useMutation} from "@apollo/client";
import { useState } from "react";
import styled from "styled-components";

//addSlot y removeSlot se hacen en CSR ya que los datos se introducen por inputs que establece el cliente y no por una url
//Realizar las operaciones en el cliente es mejor porque no se tiene que esperar a que el servidor responda
//y se puede hacer de forma asincrona
//puedes actualizar la pagina sin tener que esperar a que el servidor responda



const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;


const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 24px;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: #fff;
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  margin-right: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #0061d6;
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

const pagina = () => {

    const [year, setYear] = useState<number>(0);
    const [month, setMonth] = useState<number>(0);
    const [day, setDay] = useState<number>(0);
    const [hour, setHour] = useState<number>(0);

    const [date , setDate] = useState<Date>(new Date(0,0,0,0));

    const [addSlot] = useMutation(ADD_SLOT, {
        variables: { year: year, month: month, day: day, hour: hour},
        onCompleted: () => {
            alert("Slot fue creado");
        },
        onError: () => {
            alert("Slot ya existe");
        }

      });

    const [deleteSlot] = useMutation(DELETE_SLOT, {
        variables: { year: year, month: month, day: day, hour: hour},
        onCompleted: () => {
            alert("Slot eliminado");
        },
        onError: () => {
            alert("Slot no existe");
        }

        });

    const dateToSlot = (date: Date) => {
        setYear(date.getFullYear());
        setMonth(date.getMonth() + 1);
        setDay(date.getDate());
        setHour(date.getHours());
    }

    return (
        <>
      
            <Container>
                <Title>Medico</Title>
                <Button onClick={() => {
                    addSlot();
                }}>Crear slot</Button>
                <br></br>
                <Button onClick={() => {
                    deleteSlot();
                }}>Eliminar slot</Button>

                <br></br>
            
            <input type="datetime-local" placeholder="date" onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setDate(newDate);
                    dateToSlot(newDate);
                }} />
            </Container>
        </>
    )
}

export default pagina;
