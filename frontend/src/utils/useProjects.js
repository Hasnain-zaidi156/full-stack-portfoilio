/*
  Projects ka ek hi source:
  - Database (admin panel se manage) -> agar usme projects hain
  - warna portfolioData.js ki static list (fallback, site kabhi khali nahi dikhti)
  Collection, Resume page aur Resume PDF teeno yahin se parhte hain.
*/
import { useEffect, useState } from 'react';
import { projects as staticProjects } from '../data/portfolioData';
import { fetchProjects } from './api';
import { slugify } from './projectFeedback';

const TOOLS = new Set(['Simple Resume Maker', 'Calculator', 'Sum Checker', 'Positive & Negative Checker', 'Tasbeeh Counter', 'Todo List App']);

const normalize = (list) =>
  list.map((p) => ({
    ...p,
    slug: p.slug || slugify(p.title),
    category: p.category || (TOOLS.has(p.title) ? 'Tools & Apps' : 'Websites'),
    tags: p.tags || [],
  }));

let state = { projects: normalize(staticProjects), fromDb: false, loaded: false };
let inflight = null;
const subs = new Set();
const emit = () => subs.forEach((f) => f());

export function refreshProjects() {
  inflight = fetchProjects()
    .then((list) => {
      state = { projects: normalize(list.length ? list : staticProjects), fromDb: list.length > 0, loaded: true };
    })
    .catch(() => {
      state = { ...state, loaded: true }; // backend band / DB down — static list chalti rahe
    })
    .finally(emit);
  return inflight;
}

// PDF jaise non-React code ke liye
export const getProjects = () => state.projects;
export const getStaticProjects = () => normalize(staticProjects);

export function useProjects() {
  const [, tick] = useState(0);
  useEffect(() => {
    const f = () => tick((n) => n + 1);
    subs.add(f);
    if (!state.loaded && !inflight) refreshProjects();
    return () => subs.delete(f);
  }, []);
  return state;
}
