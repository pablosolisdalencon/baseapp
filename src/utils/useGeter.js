'use client';

import { useState, useEffect } from 'react';
import React from 'react'; // Necesario para .tsx


export default async function useGeter(){

     const [data,setData] = useState(null);
     const [loading, setLoading] = useState(true);
     const [controller, setController] = useState(null);

     useEffect(() =>{
        const abortController = new AbortController();
        setController(abortController);
        setLoading(true);
        fetch(url)
            .then( (response) => response.json())
            .then( (data) => setData(data))
            .catch((error) => setError(error))
            .finally( () => setLoading(false))
        return () => AbortController.abort();
     },[] );

   
    }
