import React from "react";
import styled from 'styled-components'
import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { getSSRClient } from "@/libs/client";

type Contact = {
  name: string;
  phone: string;
}

type availableSlots = {
  available: boolean;
  day: number;
  month: number;
  hour: number;
  year: number;
  dni: string;
}

type data = {
  availableSlots: availableSlots[];
}

export const getStaticPaths: GetStaticPaths = async () => {

  const query = gql`
   query{
    allAvailableSlots {
      year
      month
    }
  }
  `;



const client = getSSRClient();

  const {data} = await client.query<{
    allAvailableSlots: {
      year: number;
      month: number;
    }[];
  }>({
    query
  })




  const paths = data!.allAvailableSlots.map((slot: { year: { toString: () => any; }; month: { toString: () => any; }; }) => {
    const index = slot.year.toString() + slot.month.toString();
    const index2 = parseInt(index);
    return {
      params: {
        id: index2.toString(),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  
  const id = params?.id;

  const query = gql`
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
  const client = getSSRClient();

  const year = id?.toString().substring(0, 4);
  const month = id?.toString().substring(4, 6);

  const month2 = parseInt(month as string);
  const year2 = parseInt(year as string);

  console.log(year2);
  console.log(month2);


  const { data } = await client.query<{
    availableSlots: {
      available: boolean;
      day: number;
      month: number;
      hour: number;
      year: number;
      dni: string;
    }[];
  }>({
    query,
    variables: {
      year: year2,
      month: month2,
    },
  });


  
  return {
    props: {
      data,
    },
  };
}

const Index: NextPage<{ data :  data}> = ({ data }) => {
  return (
    <>
      <h1>DATOS</h1>
      <ul>
        {data.availableSlots.map((slot) => (
          <li key={slot.year}>
            {slot.year} {slot.month} {slot.day} {slot.hour} {slot.available}
          </li>
        ))}
      </ul>

      
    </>
  );
}

export default Index;