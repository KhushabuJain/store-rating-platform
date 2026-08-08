import React from 'react';

export default function StarRating({ value = 0, onChange, readOnly = false, size = 'text-lg' }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className={`inline-flex gap-0.5 ${size}`}>
      {stars.map((s) => (
        <button
          type="button"
          key={s}
          disabled={readOnly}
          onClick={() => onChange && onChange(s)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} leading-none ${
            s <= value ? 'text-yellow-400' : 'text-gray-300'
          }`}
          aria-label={`${s} star`}
        >
          ★
        </button>
      ))}
    </span>
  );
}
