import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

import { proyectos   as fbProyectos   } from '../data/proyectos'
import { proximos    as fbProximos    } from '../data/proximos'
import { testimonios as fbTestimonios } from '../data/testimonios'
import { sectores    as fbSectores    } from '../data/sectores'
import { contacto    as fbContacto    } from '../data/contacto'

// projects: usa imagen_url de Supabase; si está vacía usa la imagen
// del proyecto equivalente en el fallback estático (emparejado por posición).
function dbRowToProyecto(row, index) {
  const fb = fbProyectos[index] || fbProyectos[0]
  return {
    id:          row.id,
    imagen:      row.imagen_url || fb.imagen,
    titulo:      row.titulo,
    descripcion: row.descripcion,
    categorias:  row.categorias || [],
    fecha:       { dia: row.fecha_dia, mes: row.fecha_mes, anyo: row.fecha_anyo },
    gradiente:   row.gradiente  || fb.gradiente,
    acento:      row.acento     || fb.acento,
  }
}

// upcoming_projects: mismo patrón de fallback por posición
function dbRowToProximo(row, index) {
  const fb = fbProximos[index] || {}
  return {
    id:          row.id,
    imagen:      row.imagen_url || fb.imagen || '',
    titulo:      row.titulo,
    descripcion: row.descripcion,
    categorias:  row.categorias || [],
    gradiente:   row.gradiente  || fb.gradiente || 'linear-gradient(145deg,#0d1f2e,#020a12)',
  }
}

function dbRowToContacto(row) {
  return {
    empresa:     row.empresa,
    cif:         row.cif,
    direccion:   row.direccion,
    telefono:    row.telefono,
    telefono2:   row.telefono2,
    whatsapp:    row.whatsapp,
    whatsappMsg: row.whatsapp_msg,
    email:       row.email,
    emailRuben:  row.email_ruben,
    emailSergio: row.email_sergio,
    horario:     row.horario,
    zona:        row.zona,
    redes: {
      instagram: row.instagram,
      linkedin:  row.linkedin,
      tiktok:    row.tiktok,
    },
  }
}

export function useProyectos() {
  const [data, setData] = useState(fbProyectos)
  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('orden')
      .then(({ data: rows }) => {
        if (rows?.length) setData(rows.map((row, i) => dbRowToProyecto(row, i)))
      })
  }, [])
  return data
}

export function useProximos() {
  const [data, setData] = useState(fbProximos)
  useEffect(() => {
    supabase
      .from('upcoming_projects')
      .select('*')
      .order('orden')
      .then(({ data: rows }) => {
        if (rows?.length) setData(rows.map((row, i) => dbRowToProximo(row, i)))
      })
  }, [])
  return data
}

export function useTestimonios() {
  const [data, setData] = useState(fbTestimonios)
  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('visible', true)   // columna real: "visible", no "activo"
      .order('orden')
      .then(({ data: rows }) => {
        if (rows?.length) setData(rows)
      })
  }, [])
  return data
}

export function useSectores() {
  const [data, setData] = useState(fbSectores)
  useEffect(() => {
    supabase
      .from('sectors')
      .select('*')
      .order('orden')
      .then(({ data: rows }) => {
        if (rows?.length) setData(rows)
      })
  }, [])
  return data
}

export function useContacto() {
  const [data, setData] = useState(fbContacto)
  useEffect(() => {
    supabase
      .from('contact_info')
      .select('*')
      .eq('id', 'main')   // id TEXT 'main', no INT 1
      .single()
      .then(({ data: row }) => {
        if (row) setData(dbRowToContacto(row))
      })
  }, [])
  return data
}
