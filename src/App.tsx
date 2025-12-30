import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SetOperations from './components/SetOperations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SetOperations />} />
          {/* Add more routes here for future tools */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
