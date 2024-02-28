import { PotterAPI } from "./scripts/potter";
import "./style.css";

const Potter = new PotterAPI();
Potter.getCharacters();
Potter.initSearch();
