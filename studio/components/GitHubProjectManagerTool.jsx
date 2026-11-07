import React, { useEffect, useState, useCallback } from 'react';
import { useClient } from 'sanity';

const GITHUB_USER = 'yunusemretom';

const DEFAULT_MANUAL_PROJECTS = [
  {
    _id: 'project-manual-flight-controller-pcb',
    _type: 'project',
    sourceType: 'manual',
    status: 'published',
    stage: 'prototype',
    featured: true,
    hidden: false,
    order: 10,
    slug: { _type: 'slug', current: 'flight-controller-pcb' },
    category: 'Gömülü Sistemler & PCB',
    title: { tr: 'Uçuş Kontrol Kartı', en: 'Flight Controller Board' },
    summary: {
      tr: 'STM32/AT32 tabanlı uçuş kontrol kartı için şematik tasarım, PCB yerleşimi ve iki katmanlı prototipleme çalışması.',
      en: 'Schematic design, PCB layout and two-layer prototyping for an STM32/AT32-based flight controller board.'
    },
    contribution: {
      tr: 'Kart mimarisi, bileşen seçimi ve üretilebilirlik odaklı PCB uyarlamaları üzerinde çalışıyorum.',
      en: 'Working on board architecture, component selection and manufacturability-focused PCB adaptations.'
    },
    technologies: ['STM32', 'AT32', 'PCB Design', 'PX4 / ArduPilot']
  },
  {
    _id: 'project-manual-nobetci-gnss',
    _type: 'project',
    sourceType: 'manual',
    status: 'published',
    stage: 'research',
    featured: true,
    hidden: false,
    order: 20,
    slug: { _type: 'slug', current: 'nobetci-gnss-parazit-tespit-agi' },
    category: 'GNSS / RF Sistemleri',
    title: { tr: 'NÖBETÇİ — GNSS Parazit Tespit Ağı', en: 'NÖBETÇİ — GNSS Interference Detection Network' },
    summary: {
      tr: 'GNSS karıştırma ve yanıltma etkilerini tespit etmeye yönelik dağıtık izleme ağı konsepti.',
      en: 'A distributed monitoring network concept for detecting GNSS jamming and spoofing interference.'
    },
    contribution: {
      tr: 'Problem tanımı, sistem yaklaşımı ve çözüm mimarisi üzerine konsept geliştirme.',
      en: 'Concept development covering problem framing, system approach and solution architecture.'
    },
    technologies: ['GNSS', 'Signal Processing', 'RF Monitoring', 'Data Analysis']
  },
  {
    _id: 'project-manual-uav-systems',
    _type: 'project',
    sourceType: 'manual',
    status: 'published',
    stage: 'active',
    featured: true,
    hidden: false,
    order: 30,
    slug: { _type: 'slug', current: 'iha-sistemleri' },
    category: 'İHA Sistemleri',
    title: { tr: 'İHA Sistemleri ve Yarışma Projeleri', en: 'UAV Systems & Competition Projects' },
    summary: {
      tr: 'Sabit kanat ve döner kanat platformları etrafında mekanik, elektronik ve yazılım disiplinlerini bir araya getiren takım çalışmaları.',
      en: 'Team projects bringing mechanical, electronics and software disciplines together around fixed-wing and rotary-wing platforms.'
    },
    contribution: {
      tr: 'Yarışma çalışmaları ve teknik koordinasyon kapsamında sistem geliştirme süreçlerine katkı.',
      en: 'Contributing to system development and technical coordination within competition projects.'
    },
    technologies: ['UAV', 'Flight Control', 'Embedded Systems', 'Systems Integration']
  }
];

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function GitHubProjectManagerTool() {
  const client = useClient({ apiVersion: '2025-01-01' });
  const [ghRepos, setGhRepos] = useState([]);
  const [sanityProjects, setSanityProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [showForks, setShowForks] = useState(false);
  const [search, setSearch] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ghRes, sanityDocs] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`).then(r =>
          r.ok ? r.json() : []
        ),
        client.fetch(
          `*[_type == "project"] | order(order asc, _createdAt desc) {
            _id, title, "slug": slug.current, sourceType, githubRepo, status, hidden, featured, order, repositoryUrl
          }`
        )
      ]);
      setGhRepos(Array.isArray(ghRes) ? ghRes : []);
      setSanityProjects(Array.isArray(sanityDocs) ? sanityDocs : []);
    } catch (err) {
      setStatusMsg(`Veri yükleme hatası: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const importOrSyncRepo = async (repo, shouldPublish = true) => {
    setBusyId(repo.name);
    setStatusMsg('');
    try {
      const existing = sanityProjects.find(
        p => String(p.githubRepo || '').toLowerCase() === repo.name.toLowerCase()
      );
      const githubDataPayload = {
        repoName: repo.name,
        description: repo.description || '',
        htmlUrl: repo.html_url,
        homepage: repo.homepage || '',
        language: repo.language || '',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        updatedAt: repo.updated_at || null
      };

      if (existing) {
        // Only update githubData and visibility; NEVER overwrite user's custom title or summary
        await client
          .patch(existing._id)
          .set({
            sourceType: 'github',
            githubRepo: repo.name,
            githubData: githubDataPayload,
            includeIfForkOrArchived: Boolean(repo.fork || repo.archived)
          })
          .commit();
        setStatusMsg(`"${repo.name}" GitHub verileri güncellendi (kişisel başlık ve açıklamalarınız korundu).`);
      } else {
        const docId = `project-github-${slugify(repo.name)}`;
        await client.createIfNotExists({
          _id: docId,
          _type: 'project',
          sourceType: 'github',
          githubRepo: repo.name,
          slug: { _type: 'slug', current: slugify(repo.name) },
          status: shouldPublish ? 'published' : 'draft',
          hidden: !shouldPublish,
          featured: false,
          order: 100,
          includeIfForkOrArchived: Boolean(repo.fork || repo.archived),
          showGithubLink: true,
          repositoryUrl: repo.html_url,
          demoUrl: repo.homepage || undefined,
          githubData: githubDataPayload
        });
        setStatusMsg(`"${repo.name}" portfolyo projelerine eklendi.`);
      }
      await fetchData();
    } catch (err) {
      setStatusMsg(`Hata: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  };

  const toggleProjectField = async (doc, patchObj, label) => {
    setBusyId(doc._id);
    try {
      await client.patch(doc._id).set(patchObj).commit();
      setStatusMsg(label);
      await fetchData();
    } catch (err) {
      setStatusMsg(`Güncelleme hatası: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  };

  const syncAllMissingRepos = async () => {
    setBusyId('sync-all');
    setStatusMsg('');
    try {
      const existingNames = new Set(
        sanityProjects.map(p => String(p.githubRepo || '').toLowerCase()).filter(Boolean)
      );
      let addedCount = 0;
      let orderCounter = 100;
      for (const repo of ghRepos) {
        if (existingNames.has(repo.name.toLowerCase())) continue;
        const isForkOrMeta =
          Boolean(repo.fork) ||
          Boolean(repo.archived) ||
          repo.name.toLowerCase() === 'yunusemretom' ||
          repo.name.toLowerCase() === 'yunusemretom.github.io';
        const slug = slugify(repo.name);
        await client.createIfNotExists({
          _id: `project-github-${slug}`,
          _type: 'project',
          sourceType: 'github',
          githubRepo: repo.name,
          slug: { _type: 'slug', current: slug },
          status: isForkOrMeta ? 'hidden' : 'published',
          hidden: isForkOrMeta,
          featured: false,
          order: isForkOrMeta ? 300 + orderCounter : orderCounter,
          stage: 'active',
          includeIfForkOrArchived: false,
          showGithubLink: true,
          category: repo.language || (repo.fork ? 'Fork / Open Source' : 'Software'),
          title: {
            tr: repo.name.replace(/[-_]+/g, ' '),
            en: repo.name.replace(/[-_]+/g, ' ')
          },
          summary: {
            tr: repo.description || '',
            en: repo.description || ''
          },
          technologies: Array.from(new Set([repo.language, ...(repo.topics || [])].filter(Boolean))),
          repositoryUrl: repo.html_url,
          demoUrl: repo.homepage || undefined,
          githubData: {
            repoName: repo.name,
            description: repo.description || '',
            htmlUrl: repo.html_url,
            homepage: repo.homepage || '',
            language: repo.language || '',
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            topics: Array.isArray(repo.topics) ? repo.topics : [],
            updatedAt: repo.updated_at || null
          }
        });
        orderCounter += 10;
        addedCount++;
      }
      setStatusMsg(
        addedCount > 0
          ? `${addedCount} yeni GitHub deposu Sanity Projeler listesine otomatik aktarıldı.`
          : 'Tüm GitHub depolarınız zaten Sanity Projeler listesinde mevcut.'
      );
      await fetchData();
    } catch (err) {
      setStatusMsg(`Toplu aktarım hatası: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  };

  const seedManualProjects = async () => {
    setBusyId('seed-manual');
    try {
      for (const proj of DEFAULT_MANUAL_PROJECTS) {
        await client.createIfNotExists(proj);
      }
      setStatusMsg('Varsayılan manuel mühendislik projeleri (Uçuş Kontrol Kartı, NÖBETÇİ, İHA Sistemleri) eklendi.');
      await fetchData();
    } catch (err) {
      setStatusMsg(`Hata: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  };

  const filteredRepos = ghRepos.filter(r => {
    if (!showForks && (r.fork || r.archived)) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.language && r.language.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ padding: '28px', maxWidth: '1200px', margin: '0 auto', color: '#e8eef5' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>GitHub & Portfolyo Proje Yöneticisi</h2>
          <p style={{ margin: '6px 0 0', color: '#9baabd', fontSize: '14px' }}>
            GitHub hesabınızdaki (<strong>{GITHUB_USER}</strong>) depoları buradan seçip portfolyoya ekleyebilir, gizleyebilir, öne çıkarabilir ve sıralayabilirsiniz.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={syncAllMissingRepos}
            disabled={busyId === 'sync-all'}
            style={{
              padding: '8px 14px',
              background: '#c5e478',
              color: '#07131b',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Tüm GitHub Depolarını Otomatik Aktar
          </button>
          <button
            type="button"
            onClick={seedManualProjects}
            disabled={busyId === 'seed-manual'}
            style={{
              padding: '8px 14px',
              background: '#172536',
              color: '#53c7df',
              border: '1px solid rgba(83,199,223,0.4)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Manuel Projeleri İçe Aktar (NÖBETÇİ / PCB / İHA)
          </button>
          <button
            type="button"
            onClick={fetchData}
            style={{
              padding: '8px 14px',
              background: '#53c7df',
              color: '#07131b',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Listeyi Yenile
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: '18px',
            background: 'rgba(83,199,223,0.12)',
            border: '1px solid rgba(83,199,223,0.4)',
            borderRadius: '4px',
            fontSize: '13px'
          }}
        >
          {statusMsg}
        </div>
      )}

      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Depo adı, açıklama veya dil ara..."
          style={{
            flex: '1 1 260px',
            padding: '8px 12px',
            background: '#121c2a',
            border: '1px solid rgba(190,211,233,0.2)',
            color: '#e8eef5',
            borderRadius: '4px'
          }}
        />
        <label style={{ fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="checkbox"
            checked={showForks}
            onChange={e => setShowForks(e.target.checked)}
          />
          Fork ve arşivlenmiş depoları göster ({ghRepos.filter(r => r.fork || r.archived).length} adet)
        </label>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {filteredRepos.map(repo => {
            const linkedDoc = sanityProjects.find(
              p => String(p.githubRepo || '').toLowerCase() === repo.name.toLowerCase()
            );
            const isPublished = linkedDoc && linkedDoc.status === 'published' && !linkedDoc.hidden;
            const isHidden = linkedDoc && (linkedDoc.hidden || linkedDoc.status === 'hidden');

            return (
              <div
                key={repo.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: '#121c2a',
                  border: `1px solid ${isPublished ? 'rgba(83,199,223,0.45)' : 'rgba(190,211,233,0.12)'}`,
                  borderRadius: '4px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '15px' }}>{repo.name}</strong>
                    {repo.language && (
                      <span style={{ fontSize: '11px', padding: '2px 7px', border: '1px solid rgba(83,199,223,0.3)', color: '#53c7df' }}>
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span style={{ fontSize: '12px', color: '#c5e478' }}>★ {repo.stargazers_count}</span>
                    )}
                    {repo.fork && (
                      <span style={{ fontSize: '11px', color: '#e6a23c' }}>[Fork]</span>
                    )}
                    {isPublished && (
                      <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(197,228,120,0.15)', color: '#c5e478' }}>
                        Portfolyoda Yayında
                      </span>
                    )}
                    {isHidden && (
                      <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(245,108,108,0.15)', color: '#f56c6c' }}>
                        Gizlendi
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#9baabd' }}>{repo.description}</p>
                  )}
                  {linkedDoc?.title?.tr && (
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#53c7df' }}>
                      Özel Başlık: {linkedDoc.title.tr}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {!linkedDoc ? (
                    <>
                      <button
                        type="button"
                        disabled={busyId === repo.name}
                        onClick={() => importOrSyncRepo(repo, true)}
                        style={{
                          padding: '6px 11px',
                          background: '#53c7df',
                          color: '#07131b',
                          border: 'none',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Portfolyoda Göster
                      </button>
                      <button
                        type="button"
                        disabled={busyId === repo.name}
                        onClick={() => importOrSyncRepo(repo, false)}
                        style={{
                          padding: '6px 11px',
                          background: 'transparent',
                          color: '#9baabd',
                          border: '1px solid rgba(190,211,233,0.2)',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Gizli Olarak Kaydet
                      </button>
                    </>
                  ) : (
                    <>
                      <label style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        Sıra:
                        <input
                          type="number"
                          defaultValue={linkedDoc.order ?? 100}
                          onBlur={e => {
                            const nextOrder = Number(e.target.value);
                            if (!Number.isNaN(nextOrder) && nextOrder !== linkedDoc.order) {
                              toggleProjectField(linkedDoc, { order: nextOrder }, `"${repo.name}" sırası ${nextOrder} olarak güncellendi.`);
                            }
                          }}
                          style={{
                            width: '58px',
                            padding: '4px 6px',
                            background: '#0b111b',
                            border: '1px solid rgba(190,211,233,0.2)',
                            color: '#e8eef5',
                            borderRadius: '4px'
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        disabled={busyId === linkedDoc._id}
                        onClick={() =>
                          toggleProjectField(
                            linkedDoc,
                            { featured: !linkedDoc.featured },
                            `"${repo.name}" öne çıkarma durumu güncellendi.`
                          )
                        }
                        style={{
                          padding: '6px 10px',
                          background: linkedDoc.featured ? 'rgba(197,228,120,0.2)' : 'transparent',
                          color: linkedDoc.featured ? '#c5e478' : '#9baabd',
                          border: '1px solid rgba(190,211,233,0.2)',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {linkedDoc.featured ? '★ Öne Çıkan' : '☆ Öne Çıkar'}
                      </button>

                      <button
                        type="button"
                        disabled={busyId === linkedDoc._id}
                        onClick={() =>
                          toggleProjectField(
                            linkedDoc,
                            isPublished
                              ? { hidden: true, status: 'hidden' }
                              : { hidden: false, status: 'published' },
                            isPublished ? `"${repo.name}" gizlendi.` : `"${repo.name}" yayına alındı.`
                          )
                        }
                        style={{
                          padding: '6px 10px',
                          background: isPublished ? 'rgba(245,108,108,0.14)' : 'rgba(83,199,223,0.18)',
                          color: isPublished ? '#f56c6c' : '#53c7df',
                          border: '1px solid rgba(190,211,233,0.2)',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {isPublished ? 'Gizle' : 'Yayına Al'}
                      </button>

                      <button
                        type="button"
                        disabled={busyId === repo.name}
                        onClick={() => importOrSyncRepo(repo, isPublished)}
                        title="Özel başlık ve açıklamalarınıza dokunmadan yalnızca GitHub yıldız/dil/etiket verilerini günceller"
                        style={{
                          padding: '6px 10px',
                          background: 'transparent',
                          color: '#9baabd',
                          border: '1px solid rgba(190,211,233,0.2)',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Senkronize Et
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

