import { Capybara } from "./demo";

interface Props {
  capybara: Capybara
}

// instead of props -> destructuring of props and put in {capybara}
export default function CapybaraItem({capybara} : Props) {
	return (
		<div>
			<span>{capybara.name}</span>
			<button onClick={() => capybara.makeSound(capybara.name + " squeek")}>
				Make sound
			</button>
		</div>
	);
}
