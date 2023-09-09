import React from 'react';

const Poruke = ({ poruke, korisnik }) => {
	return (
		<div>
			{poruke.map((podaciPoruke, i) => {
				const { data, member, id } = podaciPoruke;
				const mojaPoruka = member.id === korisnik.id;
				return (
					<div
						key={id + i}
						className={`poruka ` + (mojaPoruka ? 'moja' : '')}
						style={{ background: member.clientData.boja }}
					>
						<strong style={{ marginRight: '10px' }}>
							{member.clientData.ime}:
						</strong>
						{data}
					</div>
				);
			})}
		</div>
	);
};

export default Poruke;
