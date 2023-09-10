import Korisnici from './Korisnici';
import Poruke from './Poruke';
import './app.scss';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const randomColor = require('randomcolor');
const randomName = require('boring-name-generator');

const getRandomColor = () => {
	const color = randomColor({
		luminosity: 'light',
		format: 'rgb',
	});
	return color;
};

function App() {
	const [korisnik, setKorisnik] = useState({
		ime: randomName().spaced,
		boja: getRandomColor(),
	});
	const [poruke, setPoruke] = useState([]);
	const [korisnici, setKorisnici] = useState([]);

	const [inputText, setInputText] = useState('');

	const drone = useMemo(
		() => new window.Scaledrone('giKiyfnlztJ0pbkD', { data: korisnik }),
		[]
	);

	useEffect(() => {
		drone.on('open', (error) => {
			if (error) {
				return console.error(error);
			}

			setKorisnik({
				ime: randomName().spaced,
				boja: getRandomColor(),
				id: drone.clientId,
			});

			const room = drone.subscribe('observable-room');

			room.on('open', (error) => {
				if (error) {
					return console.error(error);
				}
			});

			room.on('members', (korisnici) => {
				setKorisnici(() => [...korisnici]);
			});

			room.on('member_join', (korisnik) => {
				setKorisnici((korisnici) => [...korisnici, korisnik]);
			});

			room.on('member_leave', (korisnikKojiIzlazi) => {
				setKorisnici((korisnici) =>
					korisnici.filter((korisnik) => korisnik.id !== korisnikKojiIzlazi.id)
				);
			});

			room.on('message', (poruka) => {
				// svaki puta kada se event message pojavi u roomu, izvršiti će se funkcija u setMessages, callback ce dohvatiti zadnje stanje messages-a
				setPoruke((poruke) => [...poruke, poruka]);
				console.log(poruke);
			});
		});
	}, []);

	const pošaljiPoruku = useCallback(
		(poruka) => {
			drone.publish({
				room: 'observable-room',
				message: poruka,
			});
			setInputText('');
		},
		[drone]
	);

	const spremiPoruku = (e) => {
		setInputText(e.target.value);
	};

	const gumbEnter = useRef(null);

	const pošaljiPorukuEnterom = (event) => {
		if (event.key === 'Enter') {
			gumbEnter.current.click();
		}
	};

	return (
		<div className='App'>
			<header className='header'>
				<h1>ChatApp</h1>
			</header>
			<div className='users'>
				<Korisnici korisnici={korisnici} />
			</div>
			<div className='chat-container'>
				<div className='poruke'>
					<Poruke poruke={poruke} korisnik={korisnik} />
				</div>
				<div className='pisanje-poruke'>
					<input
						className='input'
						type='text'
						placeholder='Upiši poruku...'
						value={inputText}
						onChange={(e) => spremiPoruku(e)}
						onKeyPress={pošaljiPorukuEnterom}
					/>
					<button
						disabled={inputText.trim().length === 0}
						ref={gumbEnter}
						onClick={() => pošaljiPoruku(inputText)}
						className='gumb'
					>
						Pošalji
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
