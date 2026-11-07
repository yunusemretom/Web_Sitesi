import React, { useEffect, useState } from 'react';
import { set, unset, useFormValue } from 'sanity';

const GITHUB_USER = 'yunusemretom';

export default function GitHubRepoInput(props) {
  const { value = '', onChange, elementProps } = props;
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForks, setShowForks] = useState(false);
  const [error, setError] = useState(null);
  const currentTitle = useFormValue(['title']);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then(data => {
        if (!active || !Array.isArray(data)) return;
        setRepos(data);
        setLoading(false);
      })
      .catch(err => {
        if (!active) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleRepos = repos.filter(repo => showForks || (!repo.fork && !repo.archived));
  const selectedRepo = repos.find(r => r.name.toLowerCase() === String(value || '').toLowerCase());

  const handleSelect = event => {
    const nextVal = event.target.value;
    onChange(nextVal ? set(nextVal) : unset());
  };

  return (
    <div style={{ display: 'grid', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={value || ''}
          onChange={handleSelect}
          style={{
            flex: '1 1 260px',
            padding: '8px 10px',
            borderRadius: '4px',
            border: '1px solid #3c4a5e',
            background: '#121c2a',
            color: '#e8eef5',
            fontSize: '14px'
          }}
        >
          <option value="">— GitHub deposu seçin ({GITHUB_USER}) —</option>
          {visibleRepos.map(repo => (
            <option key={repo.id} value={repo.name}>
              {repo.name} {repo.language ? `(${repo.language})` : ''}{' '}
              {repo.stargazers_count ? `★${repo.stargazers_count}` : ''}
              {repo.fork ? ' [Fork]' : ''}
              {repo.archived ? ' [Arşiv]' : ''}
            </option>
          ))}
        </select>

        <label style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="checkbox"
            checked={showForks}
            onChange={e => setShowForks(e.target.checked)}
          />
          Fork / arşiv depoları da listele
        </label>
      </div>

      <input
        {...elementProps}
        type="text"
        value={value || ''}
        placeholder="Veya depo adını manuel yazın (örn: Yer-Istasyonu)"
        onChange={e => onChange(e.target.value ? set(e.target.value) : unset())}
        style={{
          padding: '8px 10px',
          borderRadius: '4px',
          border: '1px solid #2b3648',
          background: '#0b111b',
          color: '#e8eef5',
          fontSize: '13px'
        }}
      />

      {loading && <small style={{ color: '#9baabd' }}>GitHub depoları yükleniyor...</small>}
      {error && (
        <small style={{ color: '#e6a23c' }}>
          GitHub API listesi şu an alınamadı ({error}); depo adını yukarıdaki kutuya manuel yazabilirsiniz.
        </small>
      )}

      {selectedRepo && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(83,199,223,0.3)',
            background: 'rgba(18,28,42,0.75)',
            fontSize: '12px',
            lineHeight: 1.6,
            color: '#c9d6e4'
          }}
        >
          <div>
            <strong>GitHub Deposu:</strong> {selectedRepo.full_name}{' '}
            {selectedRepo.language ? `· Dil: ${selectedRepo.language}` : ''}{' '}
            {`· ★ ${selectedRepo.stargazers_count} · ⑂ ${selectedRepo.forks_count}`}
          </div>
          {selectedRepo.description && (
            <div>
              <strong>GitHub Açıklaması:</strong> {selectedRepo.description}
            </div>
          )}
          <div style={{ color: '#9baabd', marginTop: '4px' }}>
            Not: Aşağıdaki "Proje başlığı" veya "Kısa açıklama" alanlarını doldurursanız sizin yazdığınız özel metinler kullanılır; boş bırakırsanız GitHub bilgileri otomatik gösterilir.
            {currentTitle?.tr ? ` (Şu an özel başlık aktif: "${currentTitle.tr}")` : ''}
          </div>
        </div>
      )}
    </div>
  );
}
