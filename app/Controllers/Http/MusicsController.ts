import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Music from 'App/Models/Music'
import { v4 as uuidv4 } from 'uuid'
import Application from '@ioc:Adonis/Core/Application'


export default class MusicsController {



  private validationOptions = {
    types: ['audio', 'video'], // Allow only 'audio' and 'video' types
    size: '30mb', // Increase size limit to accommodate larger audio/video files
  }
  public async createMusicWithoutFile({ request, response }: HttpContextContract) {
    try {
      // Extract required fields from the request body
      const { userId, title, artist, url } = request.only(['userId', 'title', 'artist', 'url']);

      // Create a new music entry without the file
      const music = await Music.create({
        userId,
        title,
        artist,
        url,
      });

      // Return the created music entry with a success status
      return response.status(201).json({
        message: 'Music created successfully',
        data: music,
      });
    } catch (error) {
      // If an error occurs, return an error status
      return response.status(500).json({
        message: 'Failed to create music',
        error: error.message,
      });
    }
  }

  public async uploadFileForMusic({ request, response, params }: HttpContextContract) {
    try {
      const { musicId } = params;
      const file = request.file('file', this.validationOptions);

      if (!file) {
        return response.status(400).json({ error: 'File not provided' });
      }

      console.log('File details:', file);

      // Extract file extension from clientName
      const extRegex = /\.([^.]+)$/;
      const extMatch = file.clientName.match(extRegex);
      const extname = extMatch ? extMatch[1] : ''; // Extracted extension

      console.log('Extracted file extension:', extname);

      // Generate file name with extracted extension
      const fileName = `${uuidv4()}.${extname}`;

      console.log('Generated file name:', fileName);

      await file.move(Application.tmpPath('uploads'), {
        name: fileName,
      });

      if (!file.isValid) {
        return response.status(400).json({ error: 'File validation failed' });
      }

      // Find the music entry by ID
      const music = await Music.findOrFail(musicId);
      // Update the file name
      music.file = fileName;
      // Save the changes
      await music.save();

      // Return the updated music entry with a success status
      return response.status(200).json({
        message: 'File uploaded for music',
        data: music,
      });
    } catch (error) {
      // If an error occurs, return an error status
      return response.status(500).json({
        message: 'Failed to upload file for music',
        error: error.message,
      });
    }
  }




  public async deleteMusicById({ response, params }: HttpContextContract) {
    try {
      const { musicId } = params;

      // Find the music entry by ID
      const music = await Music.findOrFail(musicId);

      // Delete the music entry
      await music.delete();

      return response.status(200).json({
        message: 'Music deleted successfully',
      });
    } catch (error) {
      // If an error occurs, return an error status
      return response.status(500).json({
        message: 'Failed to delete music',
        error: error.message,
      });
    }
  }






  public async listMusicByUserId({ params, response }: HttpContextContract) {
    try {
      const { userId } = params;

      // Retrieve music entries associated with the user ID
      const musics = await Music.query().where('userId', userId).select('*');

      // Return the list of music entries
      return response.status(200).json({
        message: 'Music list retrieved successfully',
        data: musics,
      });
    } catch (error) {
      // If an error occurs, return an error status
      return response.status(500).json({
        message: 'Failed to list music',
        error: error.message,
      });
    }
  }





  public async listAllMusic({ response }: HttpContextContract) {
    try {
      // Retrieve all music entries
      const musics = await Music.all();

      // Return the list of all music entries
      return response.status(200).json({
        message: 'All music list retrieved successfully',
        data: musics,
      });
    } catch (error) {
      // If an error occurs, return an error status
      return response.status(500).json({
        message: 'Failed to list all music',
        error: error.message,
      });
    }
  }



}
