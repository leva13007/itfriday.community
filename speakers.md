---
title: Спікери
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const profileIcon = { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0zM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695z" clip-rule="evenodd" /></svg>' }

const speakers = [
  {
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=oleh-levchenko',
    name: 'Олег Левченко',
    title: 'Senior Full Stack Developer · Засновник IT Friday',
    org: 'The AA',
    desc: 'React, Node.js, TypeScript, AWS. 7+ років у веб-розробці. Засновник IT Friday.',
    links: [
      { icon: 'youtube', link: 'https://youtube.com/@zloyleva' },
      { icon: profileIcon, link: '/speakers/oleh-levchenko' },
    ]
  },
  {
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=oleksandr-blazheiko',
    name: 'Олександр Блажейко',
    title: 'Software Development Engineer',
    org: 'itvibe.party',
    orgLink: 'https://itvibe.party',
    desc: 'Fullstack, 7+ років. Будує AI-платформу для вивчення мов: чат, синхронний перекладач, AI-вчитель.',
    links: [
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/%D0%BE%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80-%D0%B1%D0%BB%D0%B0%D0%B6%D0%B5%D0%B9%D0%BA%D0%BE-63410965/' },
      { icon: profileIcon, link: '/speakers/oleksandr-blazheiko' },
    ]
  },
]
</script>

# Спікери

Усі хто виходив в ефір на IT Friday.

<VPTeamMembers size="small" :members="speakers" />
