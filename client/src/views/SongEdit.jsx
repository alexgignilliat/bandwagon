import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Card } from "../components/adCard.jsx";
import { Redirect } from "react-router-dom"
import API from "../utils/API";
import Button from "../components/adCustomButton.jsx";
import { isAuth } from "../components/helper";




function UserProfile() {
  const array = {
    data: [
      { album: "Fight With Tools", song: "Handlebars", artist: "1999", edit: "", delete: "" },

    ]
  }

  const [state, setState] = useState([]);

  // const [nam, setName] = useState("test name");
  // const [alb, setAlbum] = useState("test album");
  // const [dat, setDate] = useState("test date");
  // const [description, setDescription] = useState("test description");
  // const [art, setArt] = useState("test art");
  // const [artURL, setArtURL] = useState("https://i.pinimg.com/originals/20/13/ac/2013ac80f2aededf644ac3b96de44a64.jpg");
  const [page, setPage] = useState(false);

  const [newsongs, setNewSongs] = useState([]);
  const [editSong, setEditSong] = useState([]);
  const [editAlbum, setEditAlbum] = useState([]);
  const [album, setAlbum] = useState({
    title: "",
    album: "",
    description: "",
    art: "",
  });


  const getSongs = () => {
    const userId = isAuth()._id;
    API.getSongByUserId(userId)
      .then((results) => {
        console.log("all songs from db:", results.data);
        setNewSongs(results.data);




      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {

    getSongs();

  }, []);

  const deleteSongs = (song) => {
    

    const id = song._id
    API.deleteAlbum(id)
      .then((res) => {
        console.log("after delete API", res)
        getSongs()
        toast("Your song has been deleted")
      })
      .catch((err) => console.log("ERROR:" + err));

  };






  function handleEdit(song) {
    // const { albumId, title, date, _id, description} = song
   
    setState({
      albumId: song.album._id,
      title: song.title,
      album: song.album.title,
      description: song.album.description,
      art: song.album.art
    });
    setEditSong(song)
    console.log(song.albumId)
    getAlbum(song.albumId)


    // setPage(true);
    console.log("go to edit")
  }

  function renderTableHeader() {
    let header = Object.keys(array.data[0])
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  function renderTableData() {
    return newsongs.map((song) => {
   

      return (
        <tr key={song._id}>
          <td>{song.album.title}</td>
          <td>{song.title}</td>
          <td>{song.user.name}</td>
          <td><a style={{ cursor: "pointer", color: "orange" }} class='edit-song' onClick={() => handleEdit(song)}>EDIT</a></td>
          <td><a style={{ cursor: "pointer", color: "red" }} class='delete-song' id={song._id} onClick={() => deleteSongs(song)}>DELETE</a></td>
        </tr>
      )
    })
  }

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  function getAlbum(id) {
    console.log(id)
    API.getAlbum(id)
      .then((result) => {
        setEditAlbum(result.data)
        
        console.log("GOT ALBUM", result.data);
      })
  }






  function updateAlbumToDb() {
    
    let data = state
    console.log("before update")
    console.log(editAlbum)
    API.updateAlbum({
      ...data,
      ...editAlbum,
      title: data.album,
      description: data.description,
      art: data.art,
    })
      .then((result) => {
        console.log("album updated!!!", result.data);
        getSongs();
        toast("Your song has been changed");
        setState({
          _id: "",

          title: "",
          album: "",
          description: "",
          art: ""
        });
      })
  }




  const handleSubmit = e => {
    e.preventDefault();
    updateAlbumToDb();
    
    let data = state
    API.updateSong({

      ...data,
      ...editSong,
      title: data.title,
      album:{
        title: data.album,
        description: data.description,
        art: data.art
      }
    })
      .then((result) => {

      

      })
      .catch((err) => {
        console.log(err);
      });

  


  }





  return (



    <div className="content">
      {(page === true) ? (
        <Redirect to="/admin/library" />
      ) : null}
      <Container fluid>
        <Row>
          <Col md={8}>
            <Card
              title="Edit Selected Song"
              category="Please select a song from the Library to edit"
              content={
                <Form onSubmit={handleSubmit} >
                  {/* <Form.Row>


                    <Form.Group as={Col} controlId="formGridText">
                      <Form.Label>Album Title:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Album Title"
                        onChange={handleInputChange}
                        value={state.album}
                         />
                    </Form.Group>
                  </Form.Row> */}

                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridText">
                      <Form.Label>Song Name:</Form.Label>
                      <Form.Control
                        type="text"
                        value={state.title}
                        // placeholder={state.title}
                        onChange={handleInputChange}
                        name="title"

                      />
                    </Form.Group>


                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridText">
                      <Form.Label>Album Name:</Form.Label>
                      <Form.Control
                        type="text"

                        value={state.album}
                        onChange={handleInputChange}
                        name="album"
                      // disabled
                      />
                    </Form.Group>


                  </Form.Row>

                  <Form.Row>

                    <Form.Group as={Col} controlId="formGridText">
                      <Form.Label>Description:</Form.Label>
                      <Form.Control
                        type="text"

                        value={state.description}
                        onChange={handleInputChange}
                        name="description"
                      // disabled
                      />
                    </Form.Group>

                  </Form.Row>

                  <Form.Row>

                    <Form.Group as={Col} controlId="formGridText">
                      <Form.Label>Art URL:</Form.Label>
                      <Form.Control
                        type="text"

                        value={state.art}
                        onChange={handleInputChange}
                        name="art"
                      // disabled
                      />
                    </Form.Group>

                  </Form.Row>









                  <Button bsStyle="info" pullRight fill type="submit" >
                    Update Song
                    </Button>

                  <br />




                  <div className="clearfix" />
                </Form>
              }
            />


          </Col>
          <Col md={4}>
            <Card
              title="Album Art"

              ctTableFullWidth
              ctTableResponsive
              content={
                <div>
                  <center>
                    <img
                      src={state.art}
                      style={{ maxWidth: "250px" }}
                      alt=""
                    ></img>
                  </center>

                </div>
              }
            />
          </Col>
        </Row>










        <Row>
          <Col md={12}>
            <Card
              title="Uploaded Music"
              category="Welcome to Your Music Library"
              ctTableFullWidth
              ctTableResponsive
              content={
                <div>

                  <Table id='students' className="ml-3" striped hover>
                    <tbody>
                      <tr>{renderTableHeader()}</tr>
                      {renderTableData()}
                    </tbody>
                  </Table>
                </div>







              }
            />
          </Col>


        </Row>
      </Container>
    </div >
  );
}








export default UserProfile;

