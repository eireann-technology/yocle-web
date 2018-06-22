<?php
// {"page":1,"results":[{"poster_path":"\/39WJ2YoLoWyDHxpTIwWT7AOKtZT.jpg","adult":false,"overview":"Two hundred years after Lt. Ripley died, a group of scientists clone her, hoping to breed the ultimate weapon. But the new Ripley is full of surprises … as are the new aliens. Ripley must team with a band of smugglers to keep the creatures from reaching Earth.","release_date":"1997-11-12","genre_ids":[878,27,28],"id":8078,"original_title":"Alien: Resurrection","original_language":"en","title":"Alien: Resurrection","backdrop_path":"\/AdkIZ7FtqD1bO8IKxSe6IYTK38c.jpg","popularity":2.377076,"vote_count":648,"video":false,"vote_average":5.84},{"poster_path":"\/pQMPwCJ2JpPE2CyHW5Isf3KxW3o.jpg","adult":false,"overview":"The making of Alien Resurrection (1997) is covered in this feature-length documentary, created for the film's 2003 DVD release. The cast and crew tell us how this movie came to be, from it's script which never changed through production, to its initial theatrical release.","release_date":"2003-12-02","genre_ids":[99],"id":70866,"original_title":"One Step Beyond: Making 'Alien Resurrection'","original_language":"en","title":"One Step Beyond: Making 'Alien Resurrection'","backdrop_path":"\/xa9OMco3K5gbkviV0L3W4QYQw23.jpg","popularity":1.107997,"vote_count":4,"video":false,"vote_average":6}],"total_results":2,"total_pages":1}

$output = 
array('results' => 
		array(
			array(
				"poster_path" 		=> "\/39WJ2YoLoWyDHxpTIwWT7AOKtZT.jpg",
				"original_title" 	=> "Alien: Resurrection",
				"release_date" 		=> "1997-11-12",
			),
			array(
				"poster_path" 		=> "\/pQMPwCJ2JpPE2CyHW5Isf3KxW3o.jpg",
				"original_title" 	=> "One Step Beyond: Making 'Alien Resurrection",
				"release_date" 		=> "2003-12-02",
			),
		)
);
			 
echo json_encode($output);

?>			 
